import "../App.css"
import { OptionPage, Header } from "../App"
import { useState } from "react";


export default function Loans() {


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
                      option = {'loans'}
                      selectedIndex = {0}
          />
    </div>
  )
}