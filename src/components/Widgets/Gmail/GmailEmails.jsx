import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import "./Gmail.css";

const GmailEmails = () => {
  const [emails, setEmails] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const localAccessToken = localStorage.getItem('accessToken');
  
    if (!localAccessToken) {
      setAccessToken(null);
      setIsAuthenticated(false);
    }

    if (code && !localAccessToken) {
      getAccessToken(code);
    } else if (localAccessToken) {
      setAccessToken(localAccessToken);
      fetchEmails(localAccessToken);
      setIsAuthenticated(true);
    }
  }, [accessToken]);

  const getAccessToken = async (code) => {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.REACT_APP_CLIENT_ID,
          client_secret: process.env.REACT_APP_CLIENT_SECRET,
          redirect_uri: window.location.hostname === 'localhost' 
            ? 'http://localhost:3000' 
            : 'https://mixifind.vercel.app',
          grant_type: 'authorization_code',
          code: code,
        }),
      });

      const data = await response.json();
      if (data.access_token) {
        setAccessToken(data.access_token);
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token); // Refresh token'ı da sakla
        fetchEmails(data.access_token);
        setIsAuthenticated(true);
        startAccessTokenRefresh();
      } else {
        console.error("Error obtaining access token:", data);
        authorizeUser();
      }
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error("Refresh token bulunamadı. Kullanıcıyı giriş sayfasına yönlendiriyorum.");
      authorizeUser();
      return;
    }

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.REACT_APP_CLIENT_ID,
          client_secret: process.env.REACT_APP_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      const data = await response.json();
      if (data.access_token) {
        setAccessToken(data.access_token);
        localStorage.setItem('accessToken', data.access_token);
        fetchEmails(data.access_token);
      } else {
        console.error("Access token yenilenirken hata oluştu:", data);
        authorizeUser();
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      authorizeUser();
    }
  };

  const startAccessTokenRefresh = () => {
    const intervalId = setInterval(() => {
      refreshAccessToken();
    }, 50 * 60 * 1000); // 50 dakika
    return intervalId;
  };

  const fetchEmails = async (accessToken) => {
    try {
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.status === 401) {
        console.error("Unauthorized! Token may be invalid. Trying to refresh token...");
        await refreshAccessToken(); 
        return;
      }
  
      const data = await response.json();
      if (response.ok && data.messages) {
        const emailDetailsPromises = data.messages.map(msg => getEmailDetails(accessToken, msg.id));
        const emailDetails = await Promise.all(emailDetailsPromises);
        setEmails(emailDetails);
      } else {
        console.error("Error fetching emails:", data);
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };
  

  const getEmailDetails = async (token, emailId) => {
    try {
      const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const emailData = await response.json();
      return {
        subject: truncateString(emailData.payload.headers.find(header => header.name === 'Subject')?.value || "", 40),
        sender: emailData.payload.headers.find(header => header.name === 'From')?.value || "",
        date: emailData.payload.headers.find(header => header.name === 'Date')?.value || "",
      };
    } catch (error) {
      console.error("Error fetching email details:", error);
    }
  };

  const truncateString = (str, num) => {
    if (str.length <= num) return str;
    return str.slice(0, num) + '...';
  };

  const authorizeUser = () => {
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const REDIRECT_URI = window.location.hostname === 'localhost' 
      ? 'http://localhost:3000' 
      : 'https://mixifind.vercel.app';
      const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}&access_type=offline&prompt=consent`;
      window.location.href = authUrl;
      
  };

  useEffect(() => {
    if (emails.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % emails.length);
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [emails]);

  useEffect(() => {
    const intervalId = startAccessTokenRefresh();
    return () => clearInterval(intervalId); 
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setAccessToken(null);
        setIsAuthenticated(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleScroll = (e) => {
    const delta = e.deltaY;
    if (delta > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % emails.length);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + emails.length) % emails.length);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toUTCString().replace(/ GMT.*/, ""); 
  };
  

  return (
    <div className="h-[100%]">
      {!isAuthenticated ? (
        <div className="auth-prompt flex flex-col gap-1 items-center justify-center h-[125px]" >
          <h3 className="text-gray-400 text-[10px]" style={{lineHeight:"20px"}}>Please Grant Access to Your Gmail Emails</h3>
          <button onClick={authorizeUser} className="auth-button">
            <img src="images/gmail.png" alt="Gmail Logo" style={{ width: '30px', marginRight: '5px' }} />
          </button>
        </div>
      ) : (
        <div style={{ overflowY: 'hidden'}} onWheel={handleScroll} className="h-[100%]">
          <div className="gmail-container h-[100%] flex flex-col mt-2 2xl:mt-3 items-center gap-1">
            <h2 style={{letterSpacing:"1px"}} className="text-gray-400 text-[9px] 2xl:text-[15px] uppercase text-center mt-3">
              {emails[currentIndex]?.subject || "Loading..."}
            </h2>
            <hr className="mt-1 opacity-10 w-[100%]" />
            <p className="my-2 text-gray-500 text-[10px] 2xl:text-[15px] text-center">{emails[currentIndex]?.sender || ""}</p>
            <hr className="opacity-20" />
            <p className="mt-1 text-[10px] 2xl:text-[15px] text-start text-gray-500">
  {emails[currentIndex]?.date ? formatDate(emails[currentIndex]?.date) : ""}
</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GmailEmails;
