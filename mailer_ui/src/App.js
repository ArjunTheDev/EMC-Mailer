import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import './App.css';
import { useState } from 'react';
import { sendMail } from './service/ApiService';

const App = () => {
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const emailList = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
      console.log(emailList)
      setEmails(emailList.filter(item => emailRegex.test(item.A)).map(item => item.A));
    };
    reader.onabort = () => alert('File reading was aborted')
    reader.onerror = () => alert('File reading has failed')

    reader.readAsArrayBuffer(file);
  };

  const handleButtonClick = () => {
    setLoading(true);
    if (emails.length <= 0 || message.length <= 0 ) {
      alert("Invalid Email List or Message :(")
      return
    }
    sendMail(message, emails).then((response) => {
      if(response.data.success) {
        setEmails([]);
        setMessage("");
        alert(response.data.message);
        setLoading(false);
      }
    })
    .catch(() => {
      alert("Error sending email, Try again..");
      setLoading(false);
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="App-header">
      <div className="text-container">
        <textarea
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="custom-textarea"
        />
      </div>
      <div {...getRootProps()} className='dropzone-style'>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the Excel file here...</p>
        ) : (
          <p>Drag 'n' drop an Excel file here, or click to select one</p>
        )}
      </div>
      {emails && <p className="length-text">Total emails in the file : {emails.length}</p>}
      <button className="send-mail" onClick={() => handleButtonClick()} disabled={loading}>{loading ? "Sending..." : "Send"}</button>
    </div>
  );
}

export default App;
