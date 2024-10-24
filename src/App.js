import React, { useState } from 'react';
import './App copy.css'

function App() {
  const [folderName, setFolderName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (!folderName) {
      alert('Nimikenumero puuttuu!');
      return;
    }

    // Обращаемся к Electron для поиска файлов
    const results = await window.electronAPI.searchFiles(folderName, searchTerm);
    setSearchResults(results);
  };

  // Функция для открытия файла по клику
  const handleOpenFile = async (fileName) => {
    try {
      await window.electronAPI.openFile(folderName, fileName);
    } catch (error) {
      console.error('Virhe:', error);
    }
  };

  // Функция для форматирования даты
  const formatDate = (dateStr) => {
    if (dateStr.length !== 6) return dateStr;
    const year = `20${dateStr.slice(4, 6)}`;
    const month = dateStr.slice(2, 4);
    const day = dateStr.slice(0, 2);
    return `${day}.${month}.${year}`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mittäpöytäkirjän haku</h1>

      {/* Ввод для названия папки */}
      <div>
        <input
          type="text"
          placeholder="Nimikenumero"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          style={{ marginRight: '10px' }}
        />
      </div>

      {/* Ввод для фильтрации файлов по имени */}
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Tilausnumero"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleSearch}>Etsiä</button>
      </div>

      {/* Таблица с результатами поиска */}
      <div style={{ marginTop: '20px' }}>
        <h3>Tulos:</h3>
        {searchResults.length > 0 ? (
          <table border="1" cellPadding="10" cellSpacing="0">
            <thead>
              <tr>
                <th><strong>Nimikenumero</strong></th>
                <th><strong>Tilausnumero</strong></th>
                <th><strong>Aika</strong></th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((file, index) => {
                const fileName = file.split('\\').pop(); // Извлекаем только имя файла
                const [nimikenumero, tilausnumero, datePart] = fileName.replace('.xlsx', '').replace('.xls', '').split('_'); // Парсим имя файла
                const formattedDate = formatDate(datePart); // Форматируем дату
                
                return (
                  <tr key={index}>
                    <td>{nimikenumero}</td>
                    <td>
                    <button
                        onClick={() => handleOpenFile(file)}
                        style={{
                          color: 'blue',
                          textDecoration: 'underline',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                        }}
                      >
                        {tilausnumero}
                      </button>
                    </td>
                    <td>{formattedDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}

export default App;
