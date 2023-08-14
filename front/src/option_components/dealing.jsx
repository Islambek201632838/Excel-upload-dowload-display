import "../App.css"
import { OptionPage, Header } from "../App"



export default function Dealing() {

  let period_obj = {
    year: '',
    month:''
  }

  let period_str = localStorage.getItem('periodStorage');

  if(period_str !== null){
  period_obj = JSON.parse(period_str);
  }



  return ( 
  <div>
        <Header/>

        <OptionPage   year = {period_obj.year} 
                      month = {period_obj.month}
                      option = {'dealing'}
                      selectedIndex = {7}
          />
    </div>
  )
}