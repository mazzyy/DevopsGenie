import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import './AIPage.css';
import "../styles/AIPage.css";

import { useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const AIPage = () => {
  const location = useLocation();
  const initialInput = location.state?.userInput || '';
  const initialFolderStructure = location.state?.folderStructure || {};
  const [userInput, setUserInput] = useState(initialInput);
  const [pipelineContent, setPipelineContent] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (initialInput) {
      handleSubmit();
    }
  }, [initialInput]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/generate', { user_input: userInput });
      const content = response.data.pipeline_content;
      const explanationDelimiter = '**Explanation:**';
      const [pipeline, explanation] = content.split(explanationDelimiter).map(str => str.trim());
      setPipelineContent(pipeline);
      setExplanation(explanationDelimiter + '\n' + explanation);
    } catch (error) {
      setError('Error generating pipeline. Please try again.');
      console.error("Error generating pipeline", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const renderFolderStructure = (structure) => {
    return (
      <ul>
        {Object.keys(structure).map(key => (
          <Folder key={key} name={key} content={structure[key]} />
        ))}
      </ul>
    );
  };

  return (
    <div className="aipage">
      <h1>Generate CI/CD Pipeline with AI</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Describe your CI/CD requirements..."
          rows="5"
        />
        <button type="submit" onClick={handleSubmit}>Generate Pipeline</button>
      </form>
      <ClipLoader size={50} color={"#007bff"} loading={loading} />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {pipelineContent && (
        <div className="code-display">
          <h3>Generated Pipeline Configuration:</h3>
          <button className="edit-text-button" onClick={toggleEditing}>
            {isEditing ? 'Exit Edit Mode' : 'Edit'}
          </button>
          {isEditing ? (
            <textarea
              value={pipelineContent}
              onChange={(e) => setPipelineContent(e.target.value)}
              rows={50}
              cols={80}
              style={{
                width: '100%',
                fontFamily: 'monospace',
                fontSize: '16px',
                backgroundColor: '#fdf6e3',
                color: '#657b83',
                border: '1px solid #ccc',
                padding: '24px',
                borderRadius: '5px'
              }}
            />
          ) : (
            <SyntaxHighlighter language="yaml" style={solarizedlight}>
              {pipelineContent}
            </SyntaxHighlighter>
          )}
        </div>
      )}
      {explanation && (
        <div className="explanation-display">
          <h3>Pipeline Explanation:</h3>
          <SyntaxHighlighter language="yaml" style={solarizedlight}>
            {explanation}
          </SyntaxHighlighter>
        </div>
      )}
      {initialFolderStructure && (
        <div className="folder-structure">
          <h3>Folder Structure</h3>
          {renderFolderStructure(initialFolderStructure)}
        </div>
      )}
    </div>
  );
};

const Folder = ({ name, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li>
      <div className="folder-name" onClick={toggleOpen}>
        {isOpen ? '-' : '+'} {name}
      </div>
      {isOpen && content !== 'file' && (
        <div className="folder-content">
          {Array.isArray(content) ? (
            <ul>
              {content.map((item, index) => (
                <Folder key={index} name={item.name} content={item} />
              ))}
            </ul>
          ) : (
            <ul>
              {Object.keys(content).map(key => (
                <Folder key={key} name={key} content={content[key]} />
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
};

export default AIPage;
