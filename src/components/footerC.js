import React from 'react';

function Footer(props){

    return(
        <div className="footer">
       <div className="container">
           <div className="row">

        <div className="col-md-3">
        <img src="logo.jpg" className="footer-logo"/>
        <p>When in Albania, contact us! 
         </p>
<div className="col-md-3" />
            <h1> Quick Contact </h1>
       <p><i className="fa fa-phone-square"></i> +38971347</p>
            <p><i className="fa fa-envelope"></i> gerta.weather@email.com</p> 

            <p><i className="fa fa-home"></i> Bulevardi "Gjergj Fishta" </p>
           <p className="city"> Tirane, Albania</p>



       <div className="col-md-3" />
           <h1> Follow Us On </h1>
        <p><i className="fab fa-facebook-square"></i> Facebook </p> 
         <  p><i className="fab fa-youtube"></i> Youtube </p>
              <p><i className="fab fa-twitter-square"></i> Twitter </p>
           <hr />
               <p className="copyright">Made by Jugerta Idrizi</p>
               </div>
</div>
</div>
</div>
    );
}

export default Footer;
