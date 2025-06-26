import React, { useState, useEffect } from "react";
import axios from "axios";

const EmailTemplateEditor = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateContent, setTemplateContent] = useState("");
  const [templateName, setTemplateName] = useState("");

  // Fetch templates from the backend
  useEffect(() => {
    axios.get("/api/email-templates")
      .then((response) => {
        setTemplates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching templates", error);
      });
  }, []);

  // Handle template selection
  const handleTemplateSelect = (templateId) => {
    const selected = templates.find((template) => template._id === templateId);
    setSelectedTemplate(selected);
    setTemplateName(selected.name);
    setTemplateContent(selected.content);
  };

  // Handle content changes
  const handleContentChange = (e) => {
    setTemplateContent(e.target.value);
  };

  // Handle saving the template
  const handleSaveTemplate = () => {
    const updatedTemplate = {
      name: templateName,
      content: templateContent,
    };
    axios
      .put(`/api/email-templates/${selectedTemplate._id}`, updatedTemplate)
      .then(() => {
        alert("Template updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating template", error);
      });
  };

  return (
    <div style={styles.editorContainer}>
      <div style={styles.editorHeader}>Email Template Editor</div>

      {/* Template selection list */}
      <div style={styles.templateSelection}>
        <h3>Select Template</h3>
        <ul style={styles.templateList}>
          {templates.map((template) => (
            <li key={template._id} style={styles.templateListItem}>
              <button
                style={styles.templateButton}
                onClick={() => handleTemplateSelect(template._id)}
              >
                {template.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.editorForm}>
        <label htmlFor="templateName" style={styles.label}>Template Name</label>
        <input
          type="text"
          id="templateName"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          style={styles.input}
        />

        <label htmlFor="templateContent" style={styles.label}>Template Content</label>
        <textarea
          id="templateContent"
          value={templateContent}
          onChange={handleContentChange}
          style={styles.textarea}
        ></textarea>
      </div>

      <div style={styles.editorPreview}>
        <h3>Preview</h3>
        <div
          style={styles.previewContent}
          dangerouslySetInnerHTML={{ __html: templateContent }}
        />
      </div>

      <div style={styles.editorButtons}>
        <button onClick={handleSaveTemplate} style={styles.saveButton}>Save Template</button>
        <button style={styles.cancelButton}>Cancel</button>
      </div>
    </div>
  );
};

const styles = {
  editorContainer: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  editorHeader: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  templateSelection: {
    marginBottom: "20px",
  },
  templateList: {
    listStyleType: "none",
    padding: "0",
  },
  templateListItem: {
    marginBottom: "10px",
  },
  templateButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    border: "1px solid #ddd",
    backgroundColor: "#f4f4f4",
    borderRadius: "4px",
  },
  editorForm: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    height: "200px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    resize: "vertical",
  },
  editorPreview: {
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#f4f4f4",
    borderRadius: "4px",
  },
  previewContent: {
    padding: "10px",
    backgroundColor: "#ffffff",
    borderRadius: "4px",
  },
  editorButtons: {
    display: "flex",
    justifyContent: "space-between",
  },
  saveButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default EmailTemplateEditor;
