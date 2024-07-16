import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { ClipLoader } from 'react-spinners';
import '../styles/GitRepo.css'; // Import the CSS file

function GitRepo() {
    const [owner, setOwner] = useState('');
    const [repo, setRepo] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state
    const [activeTab, setActiveTab] = useState('analysis'); // Add state for active tab
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); // State for button disabled
    const navigate = useNavigate();

    // Debounced fetch function
    const fetchAnalysis = useCallback(
        debounce(async (owner, repo) => {
            if (owner && repo) {
                setLoading(true); // Start loading
                try {
                    setError(null); // Reset previous errors
                    const response = await axios.get(`http://localhost:8000/analyze_repo?owner=${owner}&repo=${repo}`);
                    setAnalysis(response.data);
                } catch (error) {
                    setAnalysis(null);
                    setError(error.response ? error.response.data.detail : 'Error analyzing repo');
                } finally {
                    setLoading(false); // End loading
                }
            }
        }, 500),
        []
    );

    // Use effect to call fetchAnalysis whenever owner or repo changes
    useEffect(() => {
        fetchAnalysis(owner, repo);
    }, [owner, repo, fetchAnalysis]);

    // Update isButtonDisabled state based on owner and repo values
    useEffect(() => {
        setIsButtonDisabled(!(owner && repo));
    }, [owner, repo]);

    const renderFolderStructure = (structure) => {
        return (
            <ul>
                {Object.keys(structure).map(key => (
                    <Folder key={key} name={key} content={structure[key]} />
                ))}
            </ul>
        );
    };

    const handleGenerateAI = () => {
        if (analysis) {
            const userInput = `Owner: ${analysis.owner}, Repository: ${analysis.repo}, Languages: ${JSON.stringify(analysis.languages)}, Frameworks: ${analysis.frameworks.join(', ')}, Folders: ${JSON.stringify(Object.keys(analysis.folder_structure))}`;
            navigate('/ai', { state: { userInput, folderStructure: analysis.folder_structure } });
        }
    };

    return (
        <div className="analyze-container">
            <h1>Analyze GitHub Repository</h1>
            <input
                type="text"
                placeholder="Owner"
                value={owner}
                onChange={e => setOwner(e.target.value)}
            />
            <input
                type="text"
                placeholder="Repository"
                value={repo}
                onChange={e => setRepo(e.target.value)}
            />
            <button
                onClick={handleGenerateAI}
                className="generate-ai-button"
                disabled={isButtonDisabled}
            >
                Generate through AI
            </button>
            {loading && (
                <div className="loading-bar">
                    <ClipLoader
                        size={50}
                        color={"#007bff"}
                        loading={loading}
                    />
                </div>
            )}
            {error && <div className="error-message">{error}</div>}
            {analysis && (
                <div className="analysis-container">
                    <div className="tab-container">
                        <div
                            className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
                            onClick={() => setActiveTab('analysis')}
                        >
                            Analysis Results
                        </div>
                        <div
                            className={`tab ${activeTab === 'folder' ? 'active' : ''}`}
                            onClick={() => setActiveTab('folder')}
                        >
                            Folder Structure
                        </div>
                    </div>
                    {activeTab === 'analysis' && (
                        <div className="analysis-results">
                            <h2>Analysis Results</h2>
                            <p><strong>Owner:</strong> {analysis.owner}</p>
                            <p><strong>Repository:</strong> {analysis.repo}</p>
                            <p><strong>Languages:</strong> {JSON.stringify(analysis.languages)}</p>
                            <p><strong>Frameworks:</strong> {analysis.frameworks.join(', ')}</p>
                        </div>
                    )}
                    {activeTab === 'folder' && (
                        <div className="folder-structure">
                            <h3>Folder Structure</h3>
                            {renderFolderStructure(analysis.folder_structure)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

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

export default GitRepo;
