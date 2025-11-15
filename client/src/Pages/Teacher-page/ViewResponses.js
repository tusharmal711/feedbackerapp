import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
} from "docx";
import { SiGoogleanalytics } from "react-icons/si";
import { FaFileExcel, FaFileWord, FaDownload, FaFilePdf } from "react-icons/fa";
import { MdOutlineHourglassEmpty } from "react-icons/md";
import { motion } from "framer-motion";
const backendUrl = process.env.REACT_APP_BACKEND_URL; 
const ViewResponses = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch(
          `${backendUrl}feedbackResponse/getResponses/${formId}`
        );
        const data = await res.json();

        if (res.ok) {
          setQuestions(data.questions || []);
          setResponses(data.responses || []);
        } else {
          alert(data.message || "Error fetching responses");
        }
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [formId]);

  // ✅ Export to Excel
  const exportToExcel = () => {
    const tableData = responses.map((resp, index) => {
      const row = {
        "S.No": index + 1,
        "Student Name": resp.studentName,
        "Student Roll No": resp.studentRoll,
      };
      questions.forEach((q, i) => {
        const ans = resp.answers.find((a) => a.questionId === q._id);
        row[`Q${i + 1}: ${q.questionText}`] = ans ? ans.response : "-";
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Feedback Responses");
    XLSX.writeFile(wb, "Feedback_Responses.xlsx");
  };

  // ✅ Export to Word
  const exportToWord = async () => {
    const rows = [];

    const headerCells = [
      "S.No",
      "Student Name",
      "Student Roll No",
      ...questions.map((q, i) => `Q${i + 1}: ${q.questionText}`),
    ].map(
      (text) =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })],
        })
    );

    rows.push(new TableRow({ children: headerCells }));

    responses.forEach((resp, index) => {
      const cells = [
        index + 1,
        resp.studentName,
        resp.studentRoll,
        ...questions.map((q) => {
          const ans = resp.answers.find((a) => a.questionId === q._id);
          return ans ? ans.response : "-";
        }),
      ].map(
        (text) =>
          new TableCell({
            children: [new Paragraph(text.toString())],
          })
      );

      rows.push(new TableRow({ children: cells }));
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "📊 Feedback Responses",
              heading: "Heading1",
            }),
            new Table({ rows }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Feedback_Responses.docx");
  };

  // ✅ Export to PDF (fixed)
  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    doc.setFontSize(18);
    doc.text("📊 Feedback Responses", 40, 40);

    const headers = [
      ["S.No", "Student Name", "Student Roll No", ...questions.map((q, i) => `Q${i + 1}`)],
    ];

    const data = responses.map((resp, index) => [
      index + 1,
      resp.studentName,
      resp.studentRoll,
      ...questions.map((q) => {
        const ans = resp.answers.find((a) => a.questionId === q._id);
        return ans ? ans.response : "-";
      }),
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 60,
      styles: { fontSize: 8, cellWidth: "wrap", overflow: "linebreak" },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save("Feedback_Responses.pdf");
  };

  // ✅ Loading state
  if (loading)
    return (
      <div className="loading-card">
        <MdOutlineHourglassEmpty size={40} color="#555" />
        <p>Loading responses...</p>
      </div>
    );

  // ✅ No responses card
  if (responses.length === 0)
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="no-response-card"
      >
        <SiGoogleanalytics size={50} color="#555" />
        <h3>No Feedback Submitted</h3>
        <p>No student has submitted feedback for this form yet.</p>
      </motion.div>
    );

  return (
    <div className="response-table-container">
      <div className="table-header">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <SiGoogleanalytics /> Feedback Responses
        </h2>

        <div
          className="export-dropdown"
          onClick={() => setShowExport(prev => !prev)}
          
           
        >
          <button className="export-btn flex items-center gap-2">
            <FaDownload /> Export
          </button>
          {showExport && (
            <div className="export-options">
              <button onClick={exportToExcel}>
                <FaFileExcel /> Export to Excel
              </button>
              <button onClick={exportToWord}>
                <FaFileWord /> Export to Word
              </button>
              <button onClick={exportToPDF}>
                <FaFilePdf /> Export to PDF
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="response-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Student Name</th>
              <th>Student Roll No</th>
              {questions.map((q, i) => (
                <th key={i}>Q{i + 1}: {q.questionText}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((resp, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{resp.studentName}</td>
                <td>{resp.studentRoll}</td>
                {questions.map((q, i) => {
                  const answerObj = resp.answers.find(
                    (a) => a.questionId === q._id
                  );
                  return (
                    <td key={i} className="answer-cell">
                      {answerObj ? answerObj.response : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewResponses;
