import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select'
import './index.css';
import greendb from './greendb.json';
import wordlist from './wordlist.json';
import classes from './Site.module.css';
import { Badge, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import StackGrid from "react-stack-grid";
import { Web, Videocam, Description, PictureAsPdf} from '@material-ui/icons';


const App = props => {

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
  }));

  const chipclasses = useStyles();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data:'Suicide bomber kills 15 in Saudi security site mosque' })
};



  const handleClick = (e) => {        
    setSelectedOption({value:e, label:e})            
    fetch('https://tidy-arcade-230811.appspot.com/predict?', requestOptions)
.then(response => response.json())
.then(data => this.setState({ postId: data.id }))
.then(data => console.log(data));

  }
 
  const top5buttons = () => {
    return (      
      <div class={chipclasses.root}>
      <Chip size='big'  label={'Submit the text'} onClick={() => handleClick('text')} />
      </div>
    )
  
  }    

{/* <button className={classes.buttonActive}>{e.Name}</button> */}

  const [selectedOption, setSelectedOption] = useState({value: '', label: 'Search'});
  console.log(selectedOption)
  // +"  "+e.freq


// console.log(counts)


// console.log(selectedOption)

  
return (
<div class={classes.main}>
  <div class={classes.header}>
    <div class={classes.title}>{"IEA NLP TEST"}</div>
    <div class={classes.maintext}>7613 tweets were used for training the BERT model.<br/>Please type any text and then it will show how close it is that describing real disaster. And click the submit the text button.
    </div>    
  </div>
    <div class={classes.box}>
     <div class={classes.resulttext}>
     <textarea
          type="text" 
          value={selectedOption.value}
          style={{width:"100%",height:300,background:`rgba(${43}, ${43}, ${43}, ${.8})`,color:'white',fontSize:32,float:'left'}}
          onChange={(e) => handleClick(e.target.value)}
        />
      </div>
      <div class={classes.resulttext}>
      <br/><br/>        
      The probablity that the text is about real disaster
      Result: 55%
      {top5buttons()}</div>
    </div>        
</div>
  );
};

export default App;



