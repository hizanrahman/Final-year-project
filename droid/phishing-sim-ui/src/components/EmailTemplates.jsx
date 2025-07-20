import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, ContentState, convertToRaw, Modifier } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
// WYSIWYG editor (react-draft-wysiwyg) imports

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    content: "",
  });
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [editId, setEditId] = useState(null); // null when creating, id when editing

  const templateOptions = [
    {
      label: "Microsoft Login",
      value: "login.html",
      preview: "/login.html",
    },
    {
      label: "Instagram Login",
      value: "instagram.html",
      preview: "/instagram.html",
    },
    {
      label: "Amazon Login",
      value: "amazon.html",
      preview: "/amazon.html",
    },
    {
      label: "iPhone Giveaway",
      value: "giveaway.html",
      preview: "/giveaway.html",
    },
  ];
  const [selectedTemplate, setSelectedTemplate] = useState(
    templateOptions[0].value,
  );

  // Insert verification link into editor
  const insertVerificationLink = (linkText = "Verify") => {
    const html = `<a href="{{verification_link}}">${linkText}</a>`;
    const blocksFromHTML = htmlToDraft(html);
    const contentState = Modifier.replaceWithFragment(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
      ).getBlockMap(),
    );
    const newState = EditorState.push(
      editorState,
      contentState,
      "insert-characters",
    );
    setEditorState(newState);
    // also update formData.content (convert to html)
    const raw = convertToRaw(newState.getCurrentContent());
    setFormData({ ...formData, content: draftToHtml(raw) });
  };

  const fetchTemplates = React.useCallback(async () => {
    try {
      const response = await fetch("/api/email-templates", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      } else {
        setMessage("❌ Failed to fetch templates");
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      setMessage("❌ Error loading templates");
    }
  }, []);

  // Fetch templates on component mount

  const handleEditSelected = () => {
    if (selectedTemplates.length !== 1) return;
    const tpl = templates.find((t) => t._id === selectedTemplates[0]);
    if (!tpl) return;
    // Load HTML -> Draft
    const blocks = htmlToDraft(tpl.content || "");
    const contentState = ContentState.createFromBlockArray(
      blocks.contentBlocks,
    );
    setEditorState(EditorState.createWithContent(contentState));
    setFormData({ name: tpl.name, subject: tpl.subject, content: tpl.content });
    setEditId(tpl._id);
    setShowForm(true);
  };

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Ensure login page is always present in templateOptions and matches saved templates list
  useEffect(() => {
    if (!templateOptions.some(opt => opt.value === "login.html")) {
      // This is safe since templateOptions is a constant array
      templateOptions.unshift({
        label: "Login Page", value: "login.html", preview: "/login.html" });
    }
    // No dependency needed since templateOptions is not a state/prop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Ensure compiled HTML is sent, not raw draftjs
    let compiledContent = formData.content;
    // If content is not already HTML, convert it
    if (editorState && editorState.getCurrentContent) {
      compiledContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    }
    const payload = {
      name: formData.name,
      subject: formData.subject,
      content: compiledContent,
    };

    try {
      const url = editId
        ? `/api/email-templates/${editId}`
        : "/api/email-templates";
      const method = editId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage(
          editId
            ? "✅ Template updated successfully!"
            : "✅ Template created successfully!",
        );
        setFormData({ name: "", subject: "", content: "" });
        setEditId(null);
        setShowForm(false);
        fetchTemplates(); // Refresh the list
      } else {
        const errorData = await response.json();
        setMessage(
          `❌ Error: ${errorData.error || (editId ? "Failed to update template" : "Failed to create template")}`,
        );
      }
    } catch (error) {
      setMessage(`❌ Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedTemplates.length === 0) {
      setMessage("❌ Please select templates to delete");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/email-templates/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ids: selectedTemplates }),
      });

      if (response.ok) {
        setMessage(
          `✅ ${selectedTemplates.length} template(s) deleted successfully!`,
        );
        setSelectedTemplates([]);
        fetchTemplates(); // Refresh the list
      } else {
        setMessage("❌ Failed to delete templates");
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplates((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId],
    );
  };

  const handleSelectAll = () => {
    if (selectedTemplates.length === templates.length) {
      setSelectedTemplates([]);
    } else {
      setSelectedTemplates(templates.map((template) => template._id));
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)",
      position: "relative",
      overflow: "hidden",
      fontFamily:
        "'Poppins', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    backgroundShapes: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
    },
    shape1: {
      position: "absolute",
      top: "5%",
      right: "10%",
      width: "300px",
      height: "300px",
      background: "linear-gradient(45deg, #00f5ff, #0080ff)",
      borderRadius: "50%",
      opacity: 0.05,
      animation: "float 8s ease-in-out infinite",
    },
    shape2: {
      position: "absolute",
      bottom: "10%",
      left: "5%",
      width: "200px",
      height: "200px",
      background: "linear-gradient(45deg, #ff006e, #8338ec)",
      borderRadius: "30px",
      opacity: 0.05,
      animation: "float 10s ease-in-out infinite reverse",
      transform: "rotate(45deg)",
    },
    content: {
      position: "relative",
      zIndex: 1,
      padding: "40px 20px",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    header: {
      textAlign: "center",
      marginBottom: "60px",
    },
    title: {
      fontSize: "48px",
      fontWeight: "700",
      background:
        "linear-gradient(135deg, #00f5ff 0%, #0080ff 50%, #8338ec 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      marginBottom: "16px",
      letterSpacing: "-0.02em",
    },
    subtitle: {
      color: "rgba(255, 255, 255, 0.7)",
      fontSize: "18px",
      fontWeight: "400",
    },
    actionBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "40px",
      flexWrap: "wrap",
      gap: "20px",
    },
    actionButtons: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
    },
    button: {
      padding: "14px 28px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "none",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    primaryButton: {
      background: "linear-gradient(135deg, #00f5ff 0%, #0080ff 100%)",
      color: "#ffffff",
    },
    primaryButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 12px 24px rgba(0, 245, 255, 0.4)",
    },
    dangerButton: {
      background: "linear-gradient(135deg, #ff006e 0%, #ff4081 100%)",
      color: "#ffffff",
    },
    dangerButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 12px 24px rgba(255, 0, 110, 0.4)",
    },
    secondaryButton: {
      background: "rgba(255, 255, 255, 0.1)",
      color: "#ffffff",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    secondaryButtonHover: {
      background: "rgba(255, 255, 255, 0.2)",
      transform: "translateY(-2px)",
    },
    templateCount: {
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: "16px",
      fontWeight: "500",
    },
    formOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(10px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      overflow: "auto", // overlay scroll
    },
    formCard: {
      maxHeight: "90vh", // allow scrolling within modal

      background: "rgba(15, 15, 35, 0.95)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(0, 245, 255, 0.2)",
      borderRadius: "24px",
      padding: "40px",
      width: "100%",
      maxWidth: "600px",
      position: "relative",
      overflowY: "auto",
    },
    formHeader: {
      textAlign: "center",
      marginBottom: "30px",
    },
    formTitle: {
      fontSize: "28px",
      fontWeight: "600",
      color: "#00f5ff",
      marginBottom: "8px",
    },
    formDivider: {
      width: "60px",
      height: "2px",
      background: "linear-gradient(90deg, transparent, #00f5ff, transparent)",
      margin: "16px auto",
    },
    inputGroup: {
      marginBottom: "24px",
    },
    label: {
      display: "block",
      color: "#00f5ff",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },
    input: {
      width: "100%",
      padding: "16px 20px",
      background: "rgba(255, 255, 255, 0.05)",
      border: "2px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "12px",
      fontSize: "16px",
      color: "#ffffff",
      transition: "all 0.3s ease",
      outline: "none",
      boxSizing: "border-box",
    },
    inputFocus: {
      background: "rgba(0, 245, 255, 0.1)",
      border: "2px solid #00f5ff",
      boxShadow: "0 0 16px rgba(0, 245, 255, 0.2)",
    },
    textarea: {
      minHeight: "120px",
      resize: "vertical",
      fontFamily: "inherit",
    },
    formActions: {
      display: "flex",
      gap: "16px",
      justifyContent: "flex-end",
      marginTop: "32px",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0",
      background: "rgba(15, 15, 35, 0.95)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(0, 245, 255, 0.2)",
      borderRadius: "24px",
      overflow: "hidden",
    },
    tableHeader: {
      background: "rgba(0, 245, 255, 0.1)",
    },
    th: {
      padding: "20px 24px",
      color: "#00f5ff",
      fontSize: "14px",
      fontWeight: "600",
      textAlign: "left",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      borderBottom: "1px solid rgba(0, 245, 255, 0.2)",
    },
    tbody: {
      background: "rgba(255, 255, 255, 0.02)",
    },
    tr: {
      transition: "all 0.2s ease",
      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    },
    trHover: {
      background: "rgba(0, 245, 255, 0.05)",
    },
    trSelected: {
      background: "rgba(0, 245, 255, 0.1)",
    },
    td: {
      padding: "20px 24px",
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: "14px",
      fontWeight: "400",
      verticalAlign: "top",
    },
    checkbox: {
      width: "20px",
      height: "20px",
      accentColor: "#00f5ff",
      cursor: "pointer",
    },
    templateName: {
      fontWeight: "600",
      color: "#ffffff",
      marginBottom: "4px",
    },
    templateDate: {
      color: "rgba(255, 255, 255, 0.6)",
      fontSize: "12px",
    },
    templateContent: {
      maxWidth: "300px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    emptyState: {
      textAlign: "center",
      padding: "80px 20px",
      color: "rgba(255, 255, 255, 0.6)",
      background: "rgba(15, 15, 35, 0.95)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(0, 245, 255, 0.2)",
      borderRadius: "24px",
    },
    emptyIcon: {
      fontSize: "64px",
      marginBottom: "20px",
      opacity: 0.5,
    },
    emptyText: {
      fontSize: "18px",
      fontWeight: "500",
      marginBottom: "12px",
    },
    emptySubtext: {
      fontSize: "14px",
      opacity: 0.7,
    },
    message: {
      position: "fixed",
      top: "30px",
      right: "30px",
      background: "rgba(15, 15, 35, 0.95)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(0, 245, 255, 0.3)",
      borderRadius: "12px",
      padding: "16px 24px",
      color: "#00f5ff",
      fontSize: "14px",
      fontWeight: "500",
      zIndex: 1001,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
    },
    loadingSpinner: {
      display: "inline-block",
      width: "16px",
      height: "16px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      borderTopColor: "#ffffff",
      animation: "spin 1s ease-in-out infinite",
    },
  };

  const TableRow = ({
    children,
    isSelected,
    isHover,
    onMouseEnter,
    onMouseLeave,
    onClick,
  }) => (
    <tr
      style={{
        ...styles.tr,
        ...(isSelected ? styles.trSelected : {}),
        ...(isHover ? styles.trHover : {}),
        cursor: "pointer",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {children}
    </tr>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        input::placeholder,
        textarea::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.backgroundShapes}>
          <div style={styles.shape1}></div>
          <div style={styles.shape2}></div>
        </div>

        <div style={styles.content}>
          <div style={styles.header}>
            <h1 style={styles.title}>Email Templates</h1>
            <p style={styles.subtitle}>
              Create and manage reusable email templates for phishing campaigns
            </p>
          </div>

          <div style={styles.actionBar}>
            <div style={styles.templateCount}>
              {templates.length} template{templates.length !== 1 ? "s" : ""}{" "}
              available
            </div>
            <div style={styles.actionButtons}>
              {selectedTemplates.length === 1 && (
                <button
                  style={{
                    ...styles.button,
                    ...styles.primaryButton,
                  }}
                  onMouseEnter={(e) =>
                    Object.assign(e.target.style, styles.primaryButtonHover)
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.target.style, {
                      ...styles.button,
                      ...styles.primaryButton,
                    })
                  }
                  onClick={handleEditSelected}
                >
                  ✏️ Edit
                </button>
              )}
              {selectedTemplates.length > 0 && (
                <button
                  style={{
                    ...styles.button,
                    ...styles.dangerButton,
                  }}
                  onMouseEnter={(e) =>
                    Object.assign(e.target.style, styles.dangerButtonHover)
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.target.style, {
                      ...styles.button,
                      ...styles.dangerButton,
                    })
                  }
                  onClick={handleDeleteSelected}
                  disabled={loading}
                >
                  {loading ? <div style={styles.loadingSpinner}></div> : "🗑️"}
                  Delete Selected ({selectedTemplates.length})
                </button>
              )}
              <button
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                }}
                onMouseEnter={(e) =>
                  Object.assign(e.target.style, styles.primaryButtonHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.target.style, {
                    ...styles.button,
                    ...styles.primaryButton,
                  })
                }
                onClick={() => setShowForm(true)
                }
              >
                ➕ Add Template
              </button>
            </div>
          </div>

          {templates.length > 0 ? (
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.th}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={
                        selectedTemplates.length === templates.length &&
                        templates.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th style={styles.th}>Template</th>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Content Preview</th>
                  <th style={styles.th}>Created</th>
                </tr>
              </thead>
              <tbody style={styles.tbody}>
                {templates.map((template, index) => {
                  const isSelected = selectedTemplates.includes(template._id);
                  const isHover = activeCard === `template-${index}`;

                  return (
                    <TableRow
                      key={template._id}
                      isSelected={isSelected}
                      isHover={isHover}
                      onMouseEnter={() => setActiveCard(`template-${index}`)}
                      onMouseLeave={() => setActiveCard(null)}
                      onClick={() => handleSelectTemplate(template._id)}
                    >
                      <td style={styles.td}>
                        <input
                          type="checkbox"
                          style={styles.checkbox}
                          checked={isSelected}
                          onChange={() => handleSelectTemplate(template._id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td style={styles.td}>
                        <div style={styles.templateName}>{template.name}</div>
                        <div style={styles.templateDate}>
                          {new Date(template.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={styles.td}>{template.subject}</td>
                      <td style={styles.td}>
                        <div style={styles.templateContent}>
                          {template.content.replace(/<[^>]*>/g, "")}
                        </div>
                      </td>
                      <td style={styles.td}>
                        {new Date(template.createdAt).toLocaleString()}
                      </td>
                    </TableRow>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📝</div>
              <div style={styles.emptyText}>No email templates found</div>
              <div style={styles.emptySubtext}>
                Create your first template to get started with email campaigns
              </div>
            </div>
          )}
        </div>

        {/* Template Form Modal */}
        {showForm && (
          <>
            <div style={{ position: "absolute", right: 20, top: 20 }}>
              <button
                type="button"
                style={styles.primaryButton}
                onClick={() => insertVerificationLink("Verify")}
              >
                Insert Verify Link
              </button>
            </div>
            <button
              type="button"
              style={styles.primaryButton}
              onClick={() => insertVerificationLink("Verify")}
            >
              Insert Verify Link
            </button>

            <div style={styles.formOverlay} onClick={() => setShowForm(false)}>
              <div style={styles.formCard} onClick={(e) => e.stopPropagation()}>
                <div style={styles.formHeader}>
                  <h2 style={styles.formTitle}>Create Email Template</h2>
                  <div style={styles.formDivider}></div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Template Name</label>
                    <input
                      type="text"
                      placeholder="Enter template name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      style={styles.input}
                      onFocus={(e) =>
                        Object.assign(e.target.style, styles.inputFocus)
                      }
                      onBlur={(e) =>
                        Object.assign(e.target.style, styles.input)
                      }
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Email Subject</label>
                    <input
                      type="text"
                      placeholder="Enter email subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                      style={styles.input}
                      onFocus={(e) =>
                        Object.assign(e.target.style, styles.inputFocus)
                      }
                      onBlur={(e) =>
                        Object.assign(e.target.style, styles.input)
                      }
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Email Content</label>
                    <Editor
                      editorState={editorState}
                      toolbar={{
                        options: [
                          "inline",
                          "blockType",
                          "list",
                          "link",
                          "history",
                        ],
                        inline: { inDropdown: false },
                      }}
                      wrapperStyle={{
                        border: "1px solid #444",
                        borderRadius: 6,
                      }}
                      editorStyle={{
                        minHeight: 200,
                        padding: 10,
                        background: "#fff",
                        color: "#000",
                      }}
                      onEditorStateChange={(state) => {
                        setEditorState(state);
                        const html = draftToHtml(
                          convertToRaw(state.getCurrentContent()),
                        );
                        setFormData({ ...formData, content: html });
                      }}
                    />
                    {/* HTML Preview for Email Content */}
                    <div style={{
                      marginTop: 16,
                      background: "#f8f8f8",
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      padding: 12,
                    }}>
                      <label style={{ fontWeight: 500, marginBottom: 8, display: "block" }}>HTML Output Preview:</label>
                      <div style={{ minHeight: 100, background: "#fff", borderRadius: 4, padding: 8 }}>
                        <iframe
                          title="HTML Content Preview"
                          style={{ width: "100%", minHeight: 100, border: "none" }}
                          srcDoc={formData.content.startsWith('<') ? formData.content : draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label
                      htmlFor="template-select"
                      style={{
                        color: "#fff",
                        fontWeight: 500,
                        marginBottom: 8,
                        display: "block",
                      }}
                    >
                      Choose a template:
                    </label>
                    <select
                      id="template-select"
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      style={{
                        background: "#181c2f",
                        color: "#fff",
                        border: "1px solid #00f5ff",
                        borderRadius: 6,
                        padding: "8px 12px",
                        fontSize: 16,
                        width: 300,
                        marginBottom: 16,
                      }}
                    >
                      {templateOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div
                      style={{
                        background: "#222",
                        borderRadius: 8,
                        padding: 12,
                        marginTop: 8,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      }}
                    >
                      <iframe
                        title="Template Preview"
                        src={templateOptions.find(
                          (opt) => opt.value === selectedTemplate,
                        ).preview}
                        style={{
                          width: "100%",
                          minHeight: 400,
                          border: "none",
                          borderRadius: 6,
                          background: "#fff",
                        }}
                      />
                    </div>
                  </div>

                  <div style={styles.formActions}>
                    <button
                      type="button"
                      style={{
                        ...styles.button,
                        ...styles.secondaryButton,
                      }}
                      onMouseEnter={(e) =>
                        Object.assign(
                          e.target.style,
                          styles.secondaryButtonHover,
                        )
                      }
                      onMouseLeave={(e) =>
                        Object.assign(e.target.style, {
                          ...styles.button,
                          ...styles.secondaryButton,
                        })
                      }
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        ...styles.button,
                        ...styles.primaryButton,
                      }}
                      onMouseEnter={(e) => {
                        if (!loading)
                          Object.assign(
                            e.target.style,
                            styles.primaryButtonHover,
                          );
                      }}
                      onMouseLeave={(e) => {
                        if (!loading)
                          Object.assign(e.target.style, {
                            ...styles.button,
                            ...styles.primaryButton,
                          });
                      }}
                    >
                      {loading ? (
                        <div style={styles.loadingSpinner}></div>
                      ) : (
                        "💾"
                      )}
                      {loading
                        ? editId
                          ? "Updating..."
                          : "Creating..."
                        : editId
                          ? "Update Template"
                          : "Create Template"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {message && <div style={styles.message}>{message}</div>}
      </div>
    </>
  );
};

export default EmailTemplates;
