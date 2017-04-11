/* The dialog system uses a set of related arrays with the eDialogIdx holding the index of the
   eDialog element in which to display as the text above the agent. If you wanted actions as well 
   as just text, you can add a third parallel array holding functions to run for each option. This
   is all then parsed in the onKeyUp function at the end of the program. The render function displays
   the agent text based on the enemy.iStage variable. */
var eDialog = [ ["Press I to Interact"],
				["Hi! How are you today?", "<1> Fine, thanks.", "<2> Ugh, don't ask...", "<3> Good-bye."],
				["Okay... Bye-bye then!"],
				["Great! What can I do for you?", "<1> One. Million. Dollars.", "<2> I'll take a kiss.", "<3> Nothing."],
				["Aww. I'd kiss you but I'm just a red box.", "<1> Thanks anyway."],
				["How about a nice game of chess?", "<1> Uhh... bye."]];
var eDialogIdx = [ [], [3,4,2], [2], [5,4,2], [2], [2] ];

var enemy = {img:null, x:496, y:192, w:32, h:48, speed:4, dx:0, dy:0, currWP:0,  
			 range:75, dxPrev:0, dyPrev:0, iStage:0, update:enemyUpdate};
// enemyWP is the waypoint array for the enemy. It starts at element 0 and goes to 4 and back to 0.
var enemyWP = [{x:256,y:192},{x:704,y:192}];