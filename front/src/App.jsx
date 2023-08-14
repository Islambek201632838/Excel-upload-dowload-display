import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import logo from './img/logo.png'
import username from './img/username.png'
import arrowLeft from './img/arrowLeft.png'
import excelIcon from './img/excel-icon.png'
import Deposits from './option_components/deposits'
import Dealing from './option_components/dealing'
import Guarantees from './option_components/guarantees'
import Loans from './option_components/loans'
import Treasury from './option_components/treasury'
import DepositGuarantees from './option_components/deposit-guarantees'
import LetterOfCredit from './option_components/letters of credit'
import OperationalCashServices from './option_components/operational cash services'
import InterbankDeposits from './option_components/interbank deposits'
import Others from './option_components/others'



function App() {


  return (
          <Router>
                <Routes>
                  
                    <Route 
                      path="/" 
                      element={<HomePage />} />

                    <Route 
                      path="/deposits" 
                      element={<Deposits />} />

                    <Route
                      path="/dealing"
                      element={<Dealing />} />

                    <Route
                      path="/deposit-guarantees"
                      element={<DepositGuarantees />} />

                    <Route
                      path="/guarantees"
                      element={<Guarantees />} />

                    <Route
                      path="/interbank deposits"
                      element={<InterbankDeposits />} />

                    <Route
                      path="/letters of credit"
                      element={<LetterOfCredit />} />      

                    <Route
                      path="/loans"
                      element={<Loans />}/>

                    <Route
                      path="/operational cash services"
                      element={<OperationalCashServices />}/>
                    

                    <Route
                      path="/treasury"
                      element={<Treasury />} />

                    <Route
                      path="/others"
                      element={<Others />} /> 

                </Routes>
            </Router>

  )
}


export function HomePage() {
    
    useEffect(() => {
    let obj = {
                        year: 2023,
                        month:5
    }
    localStorage.setItem('periodStorage', JSON.stringify(obj));
  }, []);


  return ( 
    
        <div>
          <Header/>

            <h1 style={{position:'absolute', left: '570px', top: '300px'}}>Click options on the left </h1>
            <h1 style={{position:'absolute', left: '620px', top: '350px'}}>To display files</h1>
          
          <OptionPage year = {2023} 
                      month = {5}
                      option = {''}
          />
          
          </div>

    )
}


export function OptionPage(props) {

  const productOptions = ['Займы', 'Срочные/Условные вклады клиентов', 'Вклады-гарантии клиентов','Аккредитивы', 'Гарантии', 'Операционно-кассовое обслуживание', 'Казначейство','Дилинг', 'Вклады в другие Банки(VISA/MASTERCARD)', 'Прочее'];
  const productOptionsEng = ['loans', 'deposits', 'deposit-guarantees', 'letters of credit', 'guarantees', 'operational cash services', 'treasury','dealing', 'interbank deposits', 'others'];
  const selectedIndex = props.selectedIndex; 

  let periodOption_obj = {
    year: '',
    month:''
  }

  let periodOption_str = localStorage.getItem('periodStorage');

  if(periodOption_str !== null){
    periodOption_obj  = JSON.parse(periodOption_str);
}
  
  const [isClosedMenu,SetIsClosedMenu] = useState(false);
  const [isOpenedCorrection, setIsOpenedCorrection] = useState(false);
  const [isSverkaClicked,setIsSverkaClicked] = useState(false);
  const [files, setFiles] = useState([]);
  const [option, setOption] = useState(props.option);
  const year = periodOption_obj.year;
  const month = periodOption_obj.month;


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

  
  const handleOption = (item) => { 
    setOption(item);
    console.log(`${item}_${year}-${month}`);
    return option;
  };

  
  const fetchFileList = async (option) => {

    try {
      
      let period_obj = {
        year: '',
        month:''
      }
    
      let period_str = localStorage.getItem('periodStorage');
    
      if(period_str !== null){
        period_obj  = JSON.parse(period_str);
      }

      const response = await fetch(`http://localhost:23231/files?option=${option}&year=${period_obj.year}&month=${period_obj.month}`, {
        method: 'GET',
        headers: {'Content-type':'application/vnd.ms-excel' }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const file = new File([blob], `${option}_${period_obj.year}-${period_obj.month.toString().padStart(2, '0')}.xlsx`, { type: 'application/vnd.ms-excel' });
      setFiles([file]); // Append the new file to the existing array of files
    }  catch (error) {
        console.error(`Error fetching file: ${error}`);
        }
    };

  
    useEffect(()=>{
      fetchFileList(option)
    },[JSON.parse(localStorage.getItem('periodStorage'))
  ]);
    
    
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
                          <b>Продукты </b> 
                            <ul>
                            
                            {productOptions.map((item, index) => (
                                <li className='prod_list_li' key={index}> 
                                  <Link to={`/${productOptionsEng[index]}`}
                                        onClick={() => {
                                          handleOption(productOptionsEng[index]);
                                        }}                 
                                        className={selectedIndex ==index ?'prod_list_link_active':'prod_list_link'}             
                                      >
                                        {item}
                                      </Link>
                                          </li>
                                     
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



export function Header(props) {
  
  const option = props.option; 
  let periodHeader_obj = {
                  year: '',
                  month:''
                }

  let periodHeader_str = localStorage.getItem('periodStorage');

  if(periodHeader_str !== null){
    periodHeader_obj = JSON.parse(periodHeader_str);
}

    const [year, setYear] = useState(periodHeader_obj.year);
    const [month, setMonth] = useState(periodHeader_obj.month);

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

    const fetchFileList = async (option) => {

      try {
        
        let period_obj = {
          year: '',
          month:''
        }
      
        let period_str = localStorage.getItem('periodStorage');
      
        if(period_str !== null){
          period_obj  = JSON.parse(period_str);
        }
  
        const response = await fetch(`http://localhost:23231/files?option=${option}&year=${period_obj.year}&month=${period_obj.month}`, {
          method: 'GET',
          headers: {'Content-type':'application/vnd.ms-excel' }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const blob = await response.blob();
        const file = new File([blob], `${option}_${period_obj.year}-${period_obj.month.toString().padStart(2, '0')}.xlsx`, { type: 'application/vnd.ms-excel' });
        setFiles([file]); // Append the new file to the existing array of files
      }  catch (error) {
          console.error(`Error fetching file: ${error}`);
          }
      };
  
    useEffect(() => {
      fetchFileList(option, year, month);
    }, [option, year, month]);

    const handlePeriod = (item) => {

                        let objectPeriod = {
                          year: '',
                          month: ''
                        }

                        const year = periodValues[item].year;
                        const month = periodValues[item].month;
                        objectPeriod.year = year;
                        objectPeriod.month = month;  

                        setYear(year);
                        setMonth(month);
                       
                    
                        localStorage.setItem('periodStorage', JSON.stringify(objectPeriod));
                        console.log(`${year}-${month}`);

                        
                        

    return [year,month];

  };

  

  return (

    <div className="header">

                <div>
                    <img className="logo" src={logo}/> 
                    
                </div>

                <div className="projName">Утонченный Финановый Результат</div>

                <div style={{display:'flex'}}> 
                    <div>       
                        <p style={{fontSize:'15px', marginBottom:'3px'}}> Отчетный период</p>

                        <select name="period" onChange={(e) => handlePeriod(e.target.value)}
                         defaultValue={periodDates[periodHeader_obj.month-5]} 
                          
                          >
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
)}


export default App
