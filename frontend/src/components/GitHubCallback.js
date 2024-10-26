import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function GitHubCallback() {
  const query = useQuery();
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = query.get('code');
    if (code) {
      axios.get(`${process.env.REACT_APP_BASE_URL}/github/callback?code=${code}`)
        .then(response => {
          setUserInfo(response.data.user_info);
        })
        .catch(error => {
          setError('Failed to authenticate with GitHub');
        });
    }
  }, [query]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>GitHub User Info</h1>
      <p>Name: {userInfo.name}</p>
      <p>Username: {userInfo.login}</p>
      <img src={userInfo.avatar_url} alt="avatar" width="100" />
    </div>
  );
}

export default GitHubCallback;
