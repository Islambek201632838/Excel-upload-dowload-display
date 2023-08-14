import React, {useState, useEffect} from 'react'
import './App.css'
import logo from './img/logo.png'
import username from './img/username.png'
import arrowLeft from './img/arrowLeft.png'
import excelIcon from './img/excel-icon.png'
import axios from 'axios';



function App() {

  const [isClosedMenu,SetIsClosedMenu] = useState(false);
  const [isOpenedCorrection, setIsOpenedCorrection] = useState(false);
  const [isSverkaClicked,setIsSverkaClicked] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const productOptions = ['Займы','Депозиты','Гарантии','Казначейство','Диминг'];
  const productOptionsEng = ['loans','deposits','guarantee','treasure','diming'];
  const [option, setOption] = useState('');
  const [year, setYear] = useState(2023);
  const [month, setMonth] = useState(5);

  const periodValues = {
                         'Май 2023':{   date:'Май 2023',
                                        year:2023,
                                        month: 5
                                      },
                          
                          'Июнь 2023':{ date: 'Июнь 2023',
                                        year:2023,
                                        month: 6 
                                      }
              }
                     
  const periodDates = ['Май 2023','Июнь 2023' ]    

  const data = [
                  {
                    id: '1',
                    column1: '4xx',
                    column2: '1.2млн',
                    column3: '1.1млн',
                    column4: '100тыс'
                  },

                  {
                    id: '2',
                    column1: '4yy',
                    column2: '3млн',
                    column3: '4млн',
                    column4: '0'
                  }        
];


  const handlePeriod = (item) => {
    const year = periodValues[item].year;
    const month = periodValues[item].month;

    setYear(year);
    setMonth(month);
    console.log(`${option}_${year}-${month}`);

    return [year,month];
  };
  
  const handleOption = (item) => { 
    setOption(item);
    console.log(`${item}_${year}-${month}`);
    return option;
  };
  
  const fetchFileList = async (option, year, month) => {
    try {
      const response = await fetch(`http://localhost:23231/files?option=${option}&year=${year}&month=${month}`, {
        method: 'GET',
        headers: {'Content-type':'application/vnd.ms-excel' }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const file = new File([blob], `${option}_${year}-${month.toString().padStart(2, '0')}.xlsx`, { type: 'application/vnd.ms-excel' });
      setFiles((prevFiles) => [...prevFiles, file]); // Append the new file to the existing array of files
    }  catch (error) {
        console.error(`Error fetching file: ${error}`);
        }
    };

  useEffect(() => {
    fetchFileList(option, year, month);
  }, [option, year, month]);

  const handleFileDownload = async (filename) => {
    try {
      const response = await fetch(`http://localhost:23231/download/${filename}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        throw new Error(`Error downloading file: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch('http://localhost:23231/upload', {
        method: 'POST',
        body: formData,
      });
      alert('File uploaded successfully');
      fetchFileList(option, year, month); // Refresh file list after upload
    } catch (error) {
      alert('Error uploading file:', error);
    }
  };

  return (
    
<div className="App">
      
      <div className="header">

              <div>
                  <img className="logo" src={logo}/> 
                  
              </div>

              <div className="projName">Утонченный Финановый Результат</div>

              <div style={{display:'flex'}}> 
                  <div>       
                      <p style={{fontSize:'15px', marginBottom:'3px'}}> Отчетный период</p>

                      <select name="period" onChange={(e) => handlePeriod(e.target.value)}>
                              {periodDates.map((item, index) => (
                                <option value={item} key={index} className='period'>
                                  {item}
                                </option>
                              ))}
    </select>

                              
                  </div>                     
                  <img className ="username" src={username}/>
              </div> 

      </div>


      <div className='container'>

          <div className={isClosedMenu ? "menu_box_hide": "menu_box" }>
                 
                <ul className="ul_list">
                  <img src={arrowLeft} alt="" 
                       className='arrowLeft'
                       onClick={()=>{
                                      SetIsClosedMenu(true);
                       }}      
                  />
                        <li className='ul_list_li'>
                          <b>Продукты</b>
                            <ul>
                            {productOptions.map((item, index) => (
                              <li key={index} 
                                  onClick={()=>{handleOption(productOptionsEng[index]);
                                                setSelectedIndex(index);
                                  }}
                                  className={selectedIndex ==index ?'prod_list_li_active':'prod_list_li'}>
                                  
                                    {item}</li>
                                    ))}
                            </ul>
                            
                        </li>
                        <li className='ul_list_li'><b>Аллокация</b></li>
                        <li className='ul_list_li'><b>Результат</b></li>
                </ul>

          </div>
          
          <img src={arrowLeft} alt="" 
                      className={isClosedMenu ? 'arrowRight' : 'arrowRight_hide'}
                       onClick={()=>{
                                      SetIsClosedMenu(false);
                       }}         
                               
                               />

          <div className={option == '' ? 'main_hidden':'main'}>

            <div className='upload'>

                <p style={{marginBottom:'20px', fontSize:'30px'}}>Выгрузка</p>
                <div>

                      <h4 style={{ marginBottom:'20px'}}>Files:</h4>
                      {Array.isArray(files) && files.map((file, index) => (
                        <div style={{display:'flex', alignItems:'center'}} key={index}>
                          <img src={excelIcon} alt="Excel Icon" width="20" height="20"
                             />
                          <span style={{margin:'0px 10px', fontSize:'15px'}}>{file.name}</span>
                          <button onClick={() => handleFileDownload(file.name)}
                                  style={{padding: '5px'}}
                                          >Download</button>
                        </div>
                      ))}


    </div>
                  </div>
              
              <div className='correction'>
                
                <p style={{ border:'1px solid grey', 
                            borderRadius:'10px', 
                            padding:'5px', 
                            backgroundColor:'black',
                            }}
                   onClick={()=>setIsOpenedCorrection(!isOpenedCorrection)}
                
                >Корректировка</p>

                      <div style={isOpenedCorrection ? {margin:'20px 20px'}: {display:'none'}}>
                      <input style={{marginBottom:'10px'}} onChange={handleFileUpload} type="file"  />
                            <input  type="submit"/>

                      </div>

  </div>
            <div className={isSverkaClicked ? 'sverka_hidden':'sverka'}
                            onClick={()=>{setIsSverkaClicked(true)}}               
                              >Сверка
                        </div>    



            <div style={isSverkaClicked ? {marginLeft:'50px'} : {display:'none'}}>

                <p style={{fontSize:'20px', marginTop:'30px', marginBottom:'20px'}}
                            onClick={()=>{setIsSverkaClicked(false)}}
                          
                          > Баланс</p>   

                <table>
                    <thead>
                        <tr>
                          <th>СТК</th>
                          <th>Факт</th>
                          <th>Выгрузка</th>
                          <th>Разница</th>
                        </tr>   
                    </thead>
                            
                    <tbody>
                        
                        {data.map(item => (
                              <tr key={item.id}>
                                <td>{item.column1}</td>
                                <td>{item.column2}</td>
                                <td>{item.column3}</td>
                                <td>{item.column4}</td>
                              </tr>
                        ))}
                      </tbody>
                </table>   
            </div>
            
          </div>
              


              
          </div>


      </div>
      
      
      
  )
}

export default App
