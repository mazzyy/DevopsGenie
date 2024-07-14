import React, { useState } from 'react';
import axios from 'axios';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './ConfigForm.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import GitRepo from './GitRepo';

const ConfigForm = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [language, setLanguage] = useState('Node.js');
  const [languageVersion, setLanguageVersion] = useState('');
  const [customLanguageVersion, setCustomLanguageVersion] = useState('');
  const [useCustomVersion, setUseCustomVersion] = useState(false);
  const [buildCommand, setBuildCommand] = useState('npm run build');
  const [testCommand, setTestCommand] = useState('');
  const [installCommand, setInstallCommand] = useState('npm install');
  const [environment, setEnvironment] = useState('AWS');
  const [deployOption, setDeployOption] = useState(false);
  const [useDocker, setUseDocker] = useState(false);
  const [dockerUsername, setDockerUsername] = useState('');
  const [dockerPassword, setDockerPassword] = useState('');
  const [pushBranches, setPushBranches] = useState('main');
  const [pullRequestBranches, setPullRequestBranches] = useState('main');
  const [envVars, setEnvVars] = useState('');
  const [monitoring, setMonitoring] = useState(false);
  const [securityScanning, setSecurityScanning] = useState(false);
  const [canaryDeployment, setCanaryDeployment] = useState(false);
  const [blueGreenDeployment, setBlueGreenDeployment] = useState(false);
  const [cacheDependencies, setCacheDependencies] = useState(false);
  const [linting, setLinting] = useState(false);
  const [codeCoverage, setCodeCoverage] = useState(false);
  const [staticAnalysis, setStaticAnalysis] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [conditionalSteps, setConditionalSteps] = useState(false);
  const [integrationTests, setIntegrationTests] = useState(false);
  const [deployStaging, setDeployStaging] = useState(false);
  const [deployProduction, setDeployProduction] = useState(false);
  const [ec2InstanceId, setEc2InstanceId] = useState('');
  const [ec2KeyName, setEc2KeyName] = useState('');
  const [ec2SecurityGroup, setEc2SecurityGroup] = useState('');
  const [gcpInstanceId, setGcpInstanceId] = useState('');
  const [gcpKeyFile, setGcpKeyFile] = useState('');
  const [azureInstanceId, setAzureInstanceId] = useState('');
  const [azureCredentials, setAzureCredentials] = useState('');
  const [pipelineContent, setPipelineContent] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  

  const languageOptions = {
    "Node.js": {
      versions: ['22.4.0', '21.7.3', '20.15.0', '18.20.3'],
      buildCommand: 'npm run build',
      installCommand: 'npm install',
      testCommand: 'npm test',
    },
    "Python": {
      versions: ['3.11', '3.10', '3.9', '3.8', 'custom'],
      buildCommand: 'python setup.py install',
      installCommand: 'pip install -r requirements.txt',
      testCommand: 'pytest',
    },
    "Java": {
      versions: ['17', '11', '8'],
      buildCommand: 'mvn package',
      installCommand: 'mvn install',
      testCommand: 'mvn test',
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setLanguageVersion('');
    setCustomLanguageVersion('');
    setUseCustomVersion(false);
    setBuildCommand(languageOptions[selectedLanguage].buildCommand);
    setInstallCommand(languageOptions[selectedLanguage].installCommand);
    setTestCommand(languageOptions[selectedLanguage].testCommand);
  };

  const handleLanguageVersionChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setUseCustomVersion(true);
      setLanguageVersion('');
    } else {
      setUseCustomVersion(false);
      setLanguageVersion(value);
    }
  };

  const handleBranchesChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleEnvVarsChange = (e) => {
    setEnvVars(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/generate', {
        repo_url: repoUrl,
        language,
        language_version: useCustomVersion ? customLanguageVersion : languageVersion,
        build_command: buildCommand,
        test_command: testCommand,
        install_command: installCommand,
        environment,
        deploy_option: deployOption,
        use_docker: useDocker,
        docker_username: useDocker ? dockerUsername : '',
        docker_password: useDocker ? dockerPassword : '',
        push_branches: pushBranches.split(',').map(branch => branch.trim()),
        pull_request_branches: pullRequestBranches.split(',').map(branch => branch.trim()),
        env_vars: envVars.split(',').map(envVar => envVar.trim()),
        monitoring,
        security_scanning: securityScanning,
        canary_deployment: canaryDeployment,
        blue_green_deployment: blueGreenDeployment,
        cache_dependencies: cacheDependencies,
        linting,
        code_coverage: codeCoverage,
        static_analysis: staticAnalysis,
        notifications,
        conditional_steps: conditionalSteps,
        integration_tests: integrationTests,
        deploy_staging: deployStaging,
        deploy_production: deployProduction,
        ec2_instance_id: environment === 'AWS' ? ec2InstanceId : '',
        ec2_key_name: environment === 'AWS' ? ec2KeyName : '',
        ec2_security_group: environment === 'AWS' ? ec2SecurityGroup : '',
        gcp_instance_id: environment === 'GCP' ? gcpInstanceId : '',
        gcp_key_file: environment === 'GCP' ? gcpKeyFile : '',
        azure_instance_id: environment === 'Azure' ? azureInstanceId : '',
        azure_credentials: environment === 'Azure' ? azureCredentials : ''
      });
      setPipelineContent(response.data.pipeline_content);
    } catch (error) {
      console.error("Error generating pipeline", error);
    }
  };
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    
    <div className="config-form-container">
    
      <form onSubmit={handleSubmit} className="config-form">
      <GitRepo />
        <div className="form-group">
          <label>Language:</label>
          <select value={language} onChange={handleLanguageChange} required>
            {Object.keys(languageOptions).map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Language Version:</label>
          <select value={languageVersion} onChange={handleLanguageVersionChange} required={!useCustomVersion}>
            <option value="">Select version</option>
            {languageOptions[language].versions.map(version => (
              <option key={version} value={version}>{version}</option>
            ))}
            <option value="custom">Custom</option>
          </select>
          {useCustomVersion && (
  <input
    type="text"
    value={customLanguageVersion}
    onChange={(e) => setCustomLanguageVersion(e.target.value)}
    placeholder="Enter custom version"
    required
  />
)}
</div>
<div className="form-group">
  <label>Build Command:</label>
  <input type="text" value={buildCommand} onChange={(e) => setBuildCommand(e.target.value)} required />
</div>
<div className="form-group">
  <label>Test Command (optional):</label>
  <input type="text" value={testCommand} onChange={(e) => setTestCommand(e.target.value)} placeholder="e.g., npm test" />
</div>
<div className="form-group">
  <label>Install Command:</label>
  <input type="text" value={installCommand} onChange={(e) => setInstallCommand(e.target.value)} required />
</div>
<div className="form-group">
  <label>Deployment Environment:</label>
  <select value={environment} onChange={(e) => setEnvironment(e.target.value)} required>
    <option value="AWS">AWS</option>
    <option value="Azure">Azure</option>
    <option value="GCP">GCP</option>
  </select>
</div>
<div className="form-group">
  <label>
    <input type="checkbox" checked={deployOption} onChange={(e) => setDeployOption(e.target.checked)} />
    Enable Deployment
  </label>
</div>
{deployOption && (
  <>
    {environment === 'AWS' && (
      <>
        <div className="form-group">
          <label>EC2 Instance ID:</label>
          <input type="text" value={ec2InstanceId} onChange={(e) => setEc2InstanceId(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>EC2 Key Name:</label>
          <input type="text" value={ec2KeyName} onChange={(e) => setEc2KeyName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>EC2 Security Group:</label>
          <input type="text" value={ec2SecurityGroup} onChange={(e) => setEc2SecurityGroup(e.target.value)} required />
        </div>
      </>
    )}
    {environment === 'GCP' && (
      <>
        <div className="form-group">
          <label>GCP Instance ID:</label>
          <input type="text" value={gcpInstanceId} onChange={(e) => setGcpInstanceId(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>GCP Key File:</label>
          <input type="text" value={gcpKeyFile} onChange={(e) => setGcpKeyFile(e.target.value)} required />
        </div>
      </>
    )}
    {environment === 'Azure' && (
      <>
        <div className="form-group">
          <label>Azure Instance ID:</label>
          <input type="text" value={azureInstanceId} onChange={(e) => setAzureInstanceId(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Azure Credentials:</label>
          <input type="text" value={azureCredentials} onChange={(e) => setAzureCredentials(e.target.value)} required />
        </div>
      </>
    )}
  </>
)}
<div className="form-group">
  <label>
    <input type="checkbox" checked={useDocker} onChange={(e) => setUseDocker(e.target.checked)} />
    Use Docker
  </label>
</div>
{useDocker && (
  <>
    <div className="form-group">
      <label>Docker Hub Username:</label>
      <input type="text" value={dockerUsername} onChange={(e) => setDockerUsername(e.target.value)} required />
    </div>
    <div className="form-group">
      <label>Docker Hub Password:</label>
      <input type="password" value={dockerPassword} onChange={(e) => setDockerPassword(e.target.value)} required />
    </div>
  </>
)}
<div className="form-group">
  <label>Push Branches (comma separated):</label>
  <input type="text" value={pushBranches} onChange={handleBranchesChange(setPushBranches)} />
</div>
<div className="form-group">
  <label>Pull Request Branches (comma separated):</label>
  <input type="text" value={pullRequestBranches} onChange={handleBranchesChange(setPullRequestBranches)} />
</div>
<div className="form-group">
  <label>Environment Variables (comma separated, key=value):</label>
  <input type="text" value={envVars} onChange={handleEnvVarsChange} placeholder="e.g., DB_HOST=localhost, API_KEY=12345" />
</div>

<button type="button" className="advanced-button" onClick={() => setShowAdvanced(!showAdvanced)}>
  {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
</button>

{showAdvanced && (
  <>
    <div className="form-group">
      <label>
        <input type="checkbox" checked={monitoring} onChange={(e) => setMonitoring(e.target.checked)} />
        Enable Monitoring
      </label>
    </div>
    <div className="form-group">
      <label>
        <input type="checkbox" checked={securityScanning} onChange={(e) => setSecurityScanning(e.target.checked)} />
        Enable Security Scanning
      </label>
    </div>
    <div className="form-group">
      <label>
        <input type="checkbox" checked={canaryDeployment} onChange={(e) => setCanaryDeployment(e.target.checked)} />
        Enable Canary Deployment
      </label>
    </div>
    <div className="form-group">
      <label>
        <input type="checkbox" checked={blueGreenDeployment} onChange={(e) => setBlueGreenDeployment(e.target.checked)} />
        Enable Blue-Green Deployment
      </label>
    </div>
    <div className="form-group">
      <label>
        <input type="checkbox" checked={cacheDependencies} onChange={(e) => setCacheDependencies(e.target.checked)} />
        Cache Dependencies
      </label>
    </div>
    <div className="form-group">
      <label>
        <input type="checkbox" checked={linting} onChange={(e) => setLinting(e.target.checked)} />
        Enable Linting
      </label>
    </div>
    <div className="form-group">
      <label>
        <input type="checkbox" checked={codeCoverage} onChange={(e) => setCodeCoverage(e.target.checked)} />
        Enable Code Coverage
      </label>
    </div>
    <div className="form-group">
      <label>
        <input type="checkbox" checked={staticAnalysis} onChange={(e) => setStaticAnalysis(e.target.checked)} />
        Enable Static Analysis
      </label>
    </div>
    <div className="form-group">
      <label>
        <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
        Enable Notifications
      </label>
    </div>
    <div className="form-group">
      <label>
        <input type="checkbox" checked={conditionalSteps} onChange={(e) => setConditionalSteps(e.target.checked)} />
        Enable Conditional Steps
      </label>
    </div>
    <div className="form-group">
      <label>
        <input type="checkbox" checked={integrationTests} onChange={(e) => setIntegrationTests(e.target.checked)} />
        Enable Integration Tests
      </label>
    </div>
    <div className="form-group">
      <label>
        <input type="checkbox" checked={deployStaging} onChange={(e) => setDeployStaging(e.target.checked)} />
        Enable Deploy to Staging
      </label>
    </div>
    <div className="form-group">
      <label>
        <input type="checkbox" checked={deployProduction} onChange={(e) => setDeployProduction(e.target.checked)} />
        Enable Deploy to Production
      </label>
    </div>
  </>
)}

<button type="submit" className="submit-button">Generate Pipeline</button>
</form>
<div className="code-display">
      <h3>Generated Pipeline Configuration:</h3>
      <button className="edit-text-button " onClick={toggleEditing}>
        {isEditing ? 'Exit' : 'Edit'}
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
            fontSize: '16px', // Match this to SyntaxHighlighter font size
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
</div>
);
};

export default ConfigForm;
