selected_skills= [];
selected_level="";
var skill_number=0;
var level_number=0;
var array=[];
var selectedOptions = [];
var pop_element= ""; 
var j=0;
var score=0;
var enable=0;
var questions = [];
var msg_length=0;
var globalmsg = [];
var f_array = [];
var skill_name = "";
var f_obj = {};
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }



function enabler(){
    var user = document.getElementById("uname").value;
    var url = skill_name;
    var res = encodeURIComponent(url);
    $.ajax({
        type: "GET",
        url: "http://192.168.2.15:8082/response/count?user="+user+"&skill="+res,
        contentType: "application/json",
        success: function (msg){            
            var s = document.getElementsByClassName("radio");
            var lvl_length = s.length;
            enable = msg + 1;
            if(enable>lvl_length)
                enable=lvl_length;
            for (var i = 0; i < enable; i++) {
                s[i].disabled = false; 
               
            }
        }
    });
    
}

function displayLevels() {
    document.getElementById('loader').style.display='block';
    skill_name = selected_skills.shift();
    var url = skill_name;
    var res = encodeURIComponent(url);
    $.ajax({
        type: "GET",
        url: "http://192.168.2.15:8082/questions/skills?skill="+res,
        contentType: "application/json",
        success: function (msg) {
            if (msg) {
                document.getElementById('loader').style.display='none';
                var s = msg.map(function (levels, index) { //to print the levels
                    return ("    <div class=\"funkyradios\"><div class=\"funkyradios-success\">" +
                        "<input type=\"radio\" name=\"radio\" class=\"radio\"id=\"radio" + (index + 1)
                        + "\" value=\"" + levels.level + "\" disabled/>" + " <label for=\"radio" + (index + 1) + "\"class=\"labels1\">" + levels.level +
                        "</label>" + "</div></div>")

                })
                var a = s.join(' ');
                var c = "<span class=\"level\"> Select Level for " + skill_name + " </span>" + a +
                    "<input type=\"submit\" value=\"submit\" class=\"submit_l\" id=\"submit_l\" onclick=\"ProcessLevelsPage()\" />"

                var z = document.getElementsByClassName("l");
                z[0].innerHTML = c;

                var x = document.getElementsByClassName("s");
                var y = document.getElementsByClassName("l");
                x[0].style.display = "none"
                y[0].style.display = "block"
                enabler();
            }
        },
        error: function (msg) {
            document.getElementById('loader').style.display='none';
            alert('Connection failure');
        }
    }
    );

}


function ProcessSkillsPage()
{
                var check=0;   
                var inputElements = document.getElementsByClassName('checkbox');
                for(var i=0; inputElements[i]; ++i){
                    if(inputElements[i].checked)
                    {  
                         var skill=inputElements[i].value;
                        selected_skills.push(skill);
                        check=1;
                    }   
                }   
                if(check==1){   
                    //code to dynamically display the levels of skills
                             displayLevels();         
                          }
                else{ alert("Please select atleast one skill from the following")}
}
function ProcessLevelsPage()
{  
            
                document.getElementById('loader').style.display='block';
                var check=0;   
                var inputElements = document.getElementsByClassName('radio');
                for(var i=0; inputElements[i]; ++i){
                    if(inputElements[i].checked){
                        level_number=i;
                        check=1;
                        selected_level=inputElements[i].value;           
                    }                
                }
                if (check == 1) {
                    var x = document.getElementsByClassName("l");
                    var y = document.getElementsByClassName("quizContainer");
                    x[0].style.display = "none"
                    y[0].style.display = "block"
                }
                else{ alert("Please select a level");  }     
                 j=0;
                 var skill_f = encodeURIComponent(skill_name);
                 var level_f = encodeURIComponent(selected_level);
                 $.ajax({
                     type: "GET",
                     url: "http://192.168.2.15:8082/questions/get-by-skill?skill="+skill_f+"&level="+level_f,
                     contentType: "application/json",
                     success: function (msg) {
                         if(msg)
                            {            
                                document.getElementById('loader').style.display='none';
                                msg_length = msg.length;
                                globalmsg = msg;
                                showQues(globalmsg);
                            }
                        else
                            {          
                                document.getElementById('loader').style.display='none';
                            }
                     },
                     error: function(msg){                        
                        document.getElementById('loader').style.display='none';
                     }
                 });
                 //showQues();               
                 var a = document.getElementsByClassName("next");
                 a[0].disabled=true;
}

function showQues(msg){  
        var flag = 's_img';
         questions = msg[j];
         array.push(msg[j].questionText);
         pop_element= array.pop();
         var image = msg[j].image;
         var a =  msg[j].optionSet.map(function(option,index2)
         { 
                 var  o=  "<div>"+
                 "<label><input type=\"checkbox\" class=\"checkques\" id=\"checkboxes"+(index2+1)+  "\"onClick=\"changeFlag()\"value=\""+option.optionText+"\" />" + option.optionText +
                        "</label></div>"
                 return(o)    
         })
         var d=a.join(' ');   
         if(image==null)
        {
            flag = 'h_img';
            image="";
        }
         var c=  "<li> <h4>"+(j+1)+". "+ pop_element +"</h4>"+ "<img id="+flag+" src=\""+image+"\" />"+ d +" </li><br>"    
        
         var z = document.getElementsByClassName("question_container");//to display the question
         z[0].innerHTML=c;
        
}

function changeFlag() //to enable or disable the buttons
{
        var count = 0;
        var options = document.getElementsByClassName("checkques");
        var b = document.getElementsByClassName("finalsubmit");
        var a = document.getElementsByClassName("next");
    
        for(var i =0;i<options.length;i++)
        {
            if(options[i].checked)
                count++;
        }
        if(count>0) {
            b[0].disabled=false;
            a[0].disabled=false;
            count = 0;
        }
        else if(count==0){
            b[0].disabled=true;
            a[0].disabled=true;
        }
}
function updateResponse(arr,id)
{   
    var i = 0;
    var ele = "";
    var obj = {};
    var comp = false;
    f_obj = {};
    var u = document.getElementById("uname").value;
    while(i!=arr.length)
        {
            ele = arr.pop();
            obj = {
                optionText: ele,
                qid: id
            }            
            f_array.push(obj);
    }
    if(score==(4*msg_length))
        comp = true;
    f_obj = {
        userName : u,
        skill : skill_name,
        level : selected_level,
        score : score,
        optionResponseSet : f_array,
        completed: comp
    }

}

function calcCorrect(){// for calculation of marks    
        var correct_options = [];
       selectedOptions=[]; 
        var options = questions.optionSet.map(function(opt)
        {
            if(opt.correct==true)
                correct_options.push(opt.optionText);
        })
      
        var count = 0;
        var length = correct_options.length;
        var inputElements = document.getElementsByClassName('checkques');
        for (var i = 0; inputElements[i]; ++i) {
            if (inputElements[i].checked) {
                selectedOptions.push(inputElements[i].value);
            }
        }
        var l= selectedOptions.length;
        if(l==length) {
             selectedOptions.map(function(opt,index1){
                    correct_options.map(function(cor,index2) {
                        if(opt==cor){
                                count=count+1;
                            }
                    })
                })
            }
        if(count==length)
            score+=4;
        else
            score-=1;
        updateResponse(selectedOptions,questions.qid);
 }

function showNext(){ //to display next questions
        var a = document.getElementsByClassName("next");
        a[0].disabled=true;
        calcCorrect();
        j=j+1;
        var length=msg_length;

        if(j==(length-1)) {
            showQues(globalmsg);
            var b = document.getElementsByClassName("finalsubmit");
            a[0].style.display="none";
            b[0].disabled=true;
            b[0].style.display="block";
        }
        else{
            showQues(globalmsg); 
        }
}


function ProcessQuestions(){ 
        
        calcCorrect();
        document.getElementById('loader').style.display='block';
        $.ajax({
                    type: "POST",
                    url: "http://192.168.2.15:8082/response/insert",
                    data: JSON.stringify(f_obj),
                    contentType: "application/json",
                    success: function (msg) {
                            if(msg)
                            {            
                                document.getElementById('loader').style.display='none';
                            }
                            else 
                            {
                                document.getElementById('loader').style.display='none';
                            }
                        },
                    error: function (msg) {                       
                        document.getElementById('loader').style.display='none';
                        alert('Connection failure');
                            }
                }
        );

        //Clean up starts here
        var skills_checkboxes = document.getElementsByClassName("checkbox");
        var levels_radio = document.getElementsByClassName("radio");
        for(var i=0;i<skills_checkboxes.length;i++) //Reset checkboxes
            skills_checkboxes[i].checked = false;
        for(var j=0;j<levels_radio.length;j++) //Reset radio buttons
            levels_radio[j].checked = false;
        //Clean up ends here

        //Show score in the modal here .
        var modal = document.getElementById('myModal');
        modal.style.display = "block";
        var finalScore = score + "/" + (4*globalmsg.length);
        document.getElementById('finalScore').innerHTML = finalScore;
        
}  
    
function logout()
{
    f_array = [];
    var modal = document.getElementById('myModal');
    var y = document.getElementsByClassName("quizContainer");
    var l = document.getElementsByClassName("l")
    score = 0;
    selectedOptions = [];
    modal.style.display = "none";
    y[0].style.display = "none";
    enable = 0;
    l[0].style.display = "none";
    j = 0;
    var log = document.getElementsByClassName("Login");
    log[0].style.display = "block";
    var load = document.getElementById("loader");
    load.style.display="none";
    document.getElementById("uname").value = "";
    document.getElementById("pwd").value = "";
    document.getElementById("register").style.display = "block";


}

function hideScore(){ // to hide the score popup
        f_array = [];    
        var modal = document.getElementById('myModal');
         var b = document.getElementsByClassName("finalsubmit");
            var a = document.getElementsByClassName("next");
            var y = document.getElementsByClassName("quizContainer"); 
            var l= document.getElementsByClassName("l")
        score = 0;
        selectedOptions = [];
        if(selected_skills!=""){
            modal.style.display="none";
            a[0].style.display="block";
            a[0].disabled=true;
            y[0].style.display="none"; 
            b[0].style.display="none";
            enable=0; 
            l[0].style.display="block";
            j=0;
            displayLevels();
       }
       else {   
           a[0].style.display="block";
           a[0].disabled=true;
           modal.style.display="none";
           y[0].style.display="none" ;
           b[0].style.display="none";  
           ProcessLogin();
       }
}
function Process_Instruction(){
    var x=document.getElementsByClassName("s");
    x[0].style.display="block";
    document.getElementById("instruction").style.display="none";
}
function ProcessLogin()
{   
    document.getElementById('loader').style.display='block';
    var ret_skills=[]
    $.ajax({
        type: "GET",
        url: "http://192.168.2.15:8082/skills/all",
        contentType: "application/json",
        success: function (msg) {
            if (msg) {              
            
                document.getElementById('loader').style.display='none';
                
                ret_skills=msg;
                var s = ret_skills.map(function (skills, index) { //to print the skills 
                    return ("<div class=\"funkyradio-success\">" +
                        "<input type=\"checkbox\" name=\"checkbox\" class=\"checkbox\"id=\"checkbox" + (index + 1)
                        + "\" value=\"" + skills.skill + "\" />" + " <label for=\"checkbox" + (index + 1) + "\"class=\"labels\">" + skills.skill +
                        "</label>" + "</div>")
                })
                var a = s.join(' ');
                var z = document.getElementsByClassName("funkyradio");
                z[0].innerHTML = a;

                var x = document.getElementsByClassName("Login");
                var y = document.getElementById("instruction");
                x[0].style.display = "none"
                y.style.display = "block" 
            } else {              
            
                document.getElementById('loader').style.display='none';
                alert("Unable to fetch skills data");
            }
        },
        error: function(msg)
        {
                document.getElementById('loader').style.display='none';
        }
    });
   
}


function signup(){
    var l=document.getElementsByClassName("Login");
    l[0].style.display="none";
    var s=document.getElementsByClassName("Signup");
    s[0].style.display="block";
    document.getElementById("register").style.display="none";
}


function validateLogin(){//for user authentication
    
            document.getElementById('loader').style.display='block';
            var flag = 0;
            var u = document.getElementById("uname").value;
            var p = document.getElementById("pwd").value;
            if(u=="" && p=="")
                { 
                 document.getElementById("p").innerHTML= " enter the credentials."
                 document.getElementById("s").innerHTML= ""              
            
                document.getElementById('loader').style.display='none';
                }
            else if(u=="")
               { 
                document.getElementById("s").innerHTML= " enter valid username."
                 document.getElementById("p").innerHTML= " "                
            
                document.getElementById('loader').style.display='none';
                }
            else if(p=="")
                {
                 document.getElementById("p").innerHTML= " enter valid Password."
                 document.getElementById("s").innerHTML= " ";
                 
            
                document.getElementById('loader').style.display='none';
                }
   
            if(u!="" && p!=""){
                var a = {
                    userName: u,
                    password:p
                }
                var x = JSON.stringify(a);
                $.ajax({
                    type: "POST",
                    url: "http://192.168.2.15:8082/users/q",
                    data: x,
                    contentType: "application/json",
                    success: function (msg) {
                            if(msg)
                            {
                                
                                document.getElementById('loader').style.display='none';
                                flag = 1;
                                ProcessLogin();
                                document.getElementById('register').style.display = 'none';
                            }
                            else 
                            {
                                document.getElementById('loader').style.display='none';
                                document.getElementById("p").innerHTML = "Invalid User Credentials"
                                document.getElementById("s").innerHTML = " "
                            }
                        },
                    error: function (msg) {
                        document.getElementById('loader').style.display='none';
                        alert('Connection failure');
                    }
                    }
                );
            }
}
function validateSignup(){
            var u = document.getElementById("username").value;
            var p = document.getElementById("password").value;
            var r_p = document.getElementById("re-enter_password").value;
            
            
            
            if((u=="") && (p=="") && (r_p==""))
                { 
                 document.getElementById("un").innerHTML= " "
                 document.getElementById("ps").innerHTML= ""
                 document.getElementById("rp").innerHTML= "enter the credentials." }
            else if(u=="")
               { 
                document.getElementById("un").innerHTML= " enter valid username."
                 document.getElementById("ps").innerHTML= " "
                 document.getElementById("rp").innerHTML= " "}
            else if(p=="")
                {
                 document.getElementById("un").innerHTML= "."
                 document.getElementById("ps").innerHTML= "enter valid Password ";
                 document.getElementById("rp").innerHTML= " " }
                  else if(r_p=="")
                {
                 document.getElementById("rp").innerHTML= " re-enter Password."
                 document.getElementById("un").innerHTML= " ";
                 document.getElementById("ps").innerHTML= " " }
            if(p==r_p){
   
            if(u!="" && p!=""){
                var a = {
                    userName: u,
                    password:p
                }
                var x = JSON.stringify(a);
                
                document.getElementById('loader').style.display='block';

                $.ajax({
                    type: "POST",
                    url: "http://192.168.2.15:8082/users/add",
                    data: x,
                    contentType: "application/json",
                    success: function (msg) {
                        
                        document.getElementById('loader').style.display='none';

                        if (msg) {
                            alert('Registration successful!');
                            var l = document.getElementsByClassName("Login")
                            l[0].style.display = "block";
                            var s = document.getElementsByClassName("Signup")
                            s[0].style.display = "none";
                        } else {
                            alert("User already exists!");
                        }
                    },
                    error: function(msg)
                        {
                            
                            document.getElementById('loader').style.display='none';
                            alert('Failed to connect');
                        }
                });
}}
else{
    alert("Re-enter your password");
    
}
}
