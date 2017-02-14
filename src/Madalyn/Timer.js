<script type="text/javascript">
<!--

/* global variables */
var minutecounter = 0;
var secondcounter = 0;

/* function declaration */
function checktimedispatcher() {
	document.getElementById("secondelement").innerHTML= secondcounter;
    if ( (secondcounter%60) == 0) {
      minutecounter = minutecounter + 1;
      document.getElementById("minuteelement").innerHTML= minutecounter;
      if ( (minutecounter%60) == 0)
	}
//-->
</script>
 
 <div style="width:320px;margin-left:auto;margin-right:auto;text-align:center;color:black;background-color:white">
<p align="center">TIME: <span id="timerelement">starting</span>
<br>MINUTES: <span id="minuteelement">0</span>
<br>SECONDS: <span id="secondelement">0</span>
</p></div> 