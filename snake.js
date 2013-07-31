window.onload=init;
var timer_=100;	//the speed of the snake
//var timer_inc=100;	//this is for the increment of timer
var loopTimer;
var gap=10,width_=20,height_=20;		//keep height_ and width_ of the nodes the same
var C_WIDTH,C_HEIGHT;
var XINC_CONST=gap+(width_),YINC_CONST=gap+(height_);	//the greatest value attainable by the x and y coordinates in one step
var flag=true;
var lose=false;
var auto=false;
var balls_col='#FF4458';
var user1=[37,38,39,40];
var user2=[65,87,68,83];
function node(x,y){
	this.xpos=x;
	this.ypos=y;
}
function snake(col,xinc,yinc){
	this.node_list=Array();
	this.snake_col=col;
	this.xinc=xinc;
	this.yinc=yinc;
}
snake.prototype.draw=function(){
	var size_=this.node_list.length;
	for(i=0;i<size_;i++){
			this.node_list[i].draw_me(this.snake_col);
	}
}
snake.prototype.move=function(){
	var canvas=document.getElementById("myCanvas");
	var context=canvas.getContext("2d");
	var size_=this.node_list.length;
	for(i=size_-1;i>0;i--){
			this.node_list[i].xpos=this.node_list[i-1].xpos;
			this.node_list[i].ypos=this.node_list[i-1].ypos;
	}
	if(this.xinc>=0){
		this.node_list[0].xpos=(this.node_list[0].xpos+this.xinc)%canvas.width;
	}
	else{
		this.node_list[0].xpos=this.node_list[0].xpos+this.xinc;
		if(this.node_list[0].xpos<=0){
			this.node_list[0].xpos=canvas.width-this.node_list[0].xpos;		// unsure...................
		}
	}
	if(this.yinc>=0){
		this.node_list[0].ypos=(this.node_list[0].ypos+this.yinc)%canvas.height;
	}
	else{
		this.node_list[0].ypos=this.node_list[0].ypos+this.yinc;
		if(this.node_list[0].ypos<=0){
			this.node_list[0].ypos=canvas.height-this.node_list[0].ypos;		//unsure........................
		}
	}
	
}
snake.prototype.inc_snake=function(){
	var size_=this.node_list.length;
	var x_pos=this.node_list[size_-1].xpos;
	var y_pos=this.node_list[size_-1].ypos;
	this.node_list.push(new node(x_pos,y_pos));
}
node.prototype.draw_me=function(col){
	var canvas=document.getElementById("myCanvas");
	var context=canvas.getContext("2d");
	context.beginPath();
	context.rect(this.xpos-(width_/2),this.ypos-(height_/2),width_,height_);
	context.fillStyle=col;
	context.fill();
	context.stroke();
}
function gen_new_balls(balls,all_snakes){
	var x_pos,y_pos,size_,same;
	var i;
		// this Do-While loop is for generating a ball which is not on the body of the snake
		do{
			same=false;
			var lim=(C_WIDTH/(gap+width_))-3;
			x_pos=((gap+width_)/2)*(1+((Math.ceil(Math.random()*lim))*2));
			lim=C_HEIGHT/(gap+height_)-3;
			y_pos=((gap+height_)/2)*(1+((Math.ceil(Math.random()*lim))*2));
			num_snakes=all_snakes.length;
			for(i=0;i<num_snakes;i++){
				size_=all_snakes[i].node_list.length;
				for(j=0;j<size_;j++){
					if((x_pos==all_snakes[i].node_list[j].xpos)&&(y_pos==all_snakes[i].node_list[j].ypos)){
						same=true;
						break;
					}
				}
				if(same==true){break;}
			}
		}while(same==true);
		balls.xpos=x_pos;
		balls.ypos=y_pos;
	return balls;
}
function lose_message(snake_number){
	clearTimeout(loopTimer);
	lose=true;
	alert("Game Over!");
	var p1=Number($("#p1").text());
	var p2=Number($("#p2").text());
	var wins="P1";
	var msg;
	if(p1!=p2){
		if(p1<p2){wins="P2";}
		msg=wins+" WINS!!!";
	}else{msg="It's a tie!";}
	$("<div>P1 -> "+p1+"<br/>P2 -> "+p2+"<br/>"+msg+"</div>").appendTo("body").css({
		'position':'absolute',
		'top':'34%',
		'left':'38%',
		'width':'20%',
		'font-family':'monospace',
		'font-size': '20px',
		'text-align': 'center'
	});
	$("#myCanvas").unbind("click");
	$(document).unbind("keydown");
	$("<button>Play again?</button>").appendTo("body").css({
					'position':'absolute',
					'top':'45%',
					'width':'10%',
					'left': '43%',
					'font-family':'monospace',
					'font-size': '18px'
				}).bind({
				click: function(){location.reload();}
				});
	$(document).bind("keydown",function(e){
		if(e.keyCode==13)
		{
			location.reload();
		}
		else{
			if(e.keyCode==72){
					//this is the help key.'H'
					$("<div>Controls: <br/>(UP,RIGHT,DOWN,LEFT)<br/>P1:(&uarr; &rarr; &darr; &larr;) <br/> P2:(W D S A) <br/>Click for Pause/Play.<br/>Press P for Player2-Comp toggling.<br />Press H to see this again.</div>").appendTo("body").css({
						'position':'absolute',
						'top':'5px',
						'width':'50%',
						'left': '40%',
						'display': 'none',
						'font-family':'monospace',
						'font-size': '18px'
						}).fadeIn().delay(10000).fadeOut('slow');
				}
		}
	});
}
function init(){
	//setting the size of the canvas according to the width and the height of the screen
	var w,h;
	if(!isNaN(window.innerWidth)){
		w=window.innerWidth;
		h=window.innerHeight;
	}
	else{	//for IE8
		w=screen.availWidth;
		h=screen.availHeight;
		h=h-100;
	}
	if (w%30!=0){
		w=w-(w%30);
	}
	if(h%30!=0){
		h=h-(h%30);
	}	
	document.getElementById("myCanvas").width=w;
	document.getElementById("myCanvas").height=h;
	//Message
	$("<div>Controls: <br/>(UP,RIGHT,DOWN,LEFT)<br/>P1:(&uarr; &rarr; &darr; &larr;) <br/> P2:(W D S A) <br/>Click for Pause/Play.<br/>Press P for Player2-Comp toggling.<br />Press H to see this again.</div>").appendTo("body").css({
	'position':'absolute',
	'top':'5px',
	'width':'50%',
	'left': '40%',
	'display': 'none',
	//'border':'1px solid #000',
	'font-family':'monospace',
	'font-size': '18px'
	}).delay(2000).fadeIn().delay(5000).fadeOut('slow');
	//Pause and start
	$("#myCanvas").bind("click",function(){
		if(flag){
			clearTimeout(loopTimer);
			$("<div>Pause</div>").appendTo("body").css({
			'position':'absolute',
			'top':'45%',
			'width':'4%',
			'left': '45%',
			'padding':'2px',
			'display': 'none',
			'font-family':'monospace',
			'font-size': '18px'
			}).fadeIn().delay(500).fadeOut('slow');
			$(document).unbind("keydown");
			$(document).bind("keydown",function(e){
				switch(e.keyCode){
					case 72:
							//this is the help key.'H'
							$("<div>Controls: <br/>(UP,RIGHT,DOWN,LEFT)<br/>P1:(&uarr; &rarr; &darr; &larr;) <br/> P2:(W D S A) <br/>Click for Pause/Play.<br/>Press P for Player2-Comp toggling.<br />Press H to see this again.</div>").appendTo("body").css({
								'position':'absolute',
								'top':'5px',
								'width':'50%',
								'left': '40%',
								'display': 'none',
								'font-family':'monospace',
								'font-size': '18px'
								}).fadeIn().delay(10000).fadeOut('slow');
								break;
				}
			})
			flag=false;
		}
		else{
				animate_(all_snakes,balls);
				$("<div>Play</div>").appendTo("body").css({
				'position':'absolute',
				'top':'45%',
				'width':'3%',
				'left': '45%',
				'padding':'2px',
				'display': 'none',
				'font-family':'monospace',
				'font-size': '18px'
				}).fadeIn().delay(500).fadeOut('slow');
				$(document).unbind("keydown");
				user_controls(all_snakes,0,user1,balls);
				if(auto==false){
					user_controls(all_snakes,1,user2,balls);
				}
				auto_mode(all_snakes,balls);
				flag=true;
		}
	});	
	var canvas=document.getElementById("myCanvas");
	var context=canvas.getContext("2d");
	C_WIDTH=canvas.width;
	C_HEIGHT=canvas.height;
	var snake1=new snake('#234452',0,-1*YINC_CONST);
	var snake2=new snake('#F2395F',0,-1*YINC_CONST);
	$("#p1").css({
		'background-color': snake1.snake_col,
		
	});
	$("#p2").css({
		'background-color':snake2.snake_col
	});
	var y=15;
	for(i=0;i<6;i++,y=y+30){
		snake1.node_list.push(new node(75,y));
		snake2.node_list.push(new node(45,y));
	}
	snake1.draw();
	snake2.draw();
	var all_snakes=[];
	all_snakes.push(snake1);
	all_snakes.push(snake2);
	var balls=new node(0,0);
    balls=gen_new_balls(balls,all_snakes);
	balls.draw_me(balls_col);
	auto_mode(all_snakes,balls);
	animate_(all_snakes,balls);
	//User controls.Have to be modified when there are multiple players.
	user_controls(all_snakes,0,user1,balls);									//$(document).bind("keydown",,function(e){});
	if(auto==false){
		user_controls(all_snakes,1,user2,balls);
	}
}
function animate_(all_snakes,balls){
	var canvas=document.getElementById("myCanvas");
	var context=canvas.getContext("2d");
	context.clearRect(0,0,canvas.width,canvas.height);
	var num_snakes=all_snakes.length;
	var i,j,k,l,p;
	//This is for checking if auto mode is on;
	if(auto==true){
		all_snakes[1]=get_directions(all_snakes,balls);
		//alert("here");
	}
	//Movement of all the snakes.
	for(i=0;i<num_snakes;i++){
		all_snakes[i].move();	
	}
	//for intra-snake collision
	for(p=0;p<num_snakes;p++){
		size_=all_snakes[p].node_list.length;
		var pre_snake=all_snakes[p].node_list;
		for(i=0;i<size_-1;i++){
			for(j=i+1;j<size_;j++){
				if((pre_snake[i].xpos==pre_snake[j].xpos)&&(pre_snake[i].ypos==pre_snake[j].ypos)){
					lose_message(i);
				}
			}
		} 
	}
	//for inter snake collision
	//---------------------------temporarily commented---------------------------
	/*
	if(lose==false){
		size1=all_snakes[0].node_list.length;
		size2=all_snakes[1].node_list.length;
		for(i=0;i<size1;i++){
			for(j=0;j<size2;j++){
				if((all_snakes[0].node_list[i].xpos==all_snakes[1].node_list[j].xpos)&&(all_snakes[0].node_list[i].ypos==all_snakes[1].node_list[j].ypos)){
					lose=true;
					lose_message(100);
					break;
				}
			}
			if(lose==true){break;}
		}
	}
	*/
	if(lose==false){
		//for checking if the ball has been eaten
		for(i=0;i<num_snakes;i++){
			var pre_snake=all_snakes[i].node_list;
			if(pre_snake[0].xpos==balls.xpos&&pre_snake[0].ypos==balls.ypos){
				$("#p"+(i+1)).text(Number($("#p"+(i+1)).text())+1);		//increment the points
				balls=gen_new_balls(balls,all_snakes);		//generate a new ball position
				all_snakes[i].inc_snake();				//increment the snake by one
			}
		}
		//for drawing
		for(i=0;i<num_snakes;i++){
			all_snakes[i].draw();
		}
		balls.draw_me(balls_col);
		loopTimer=setTimeout(function(){animate_(all_snakes,balls);},timer_);
	}
}
function user_controls(all_snakes,index,user_con,balls){
	var snake=all_snakes[index];
	$(document).bind("keydown",function(e){	
		var key_=e.keyCode;
		switch(key_){
			case user_con[0]:
					//left	key 
					if(snake.xinc==0){
						snake.yinc=0;
						snake.xinc=-1*XINC_CONST;
						/*adding these two lines makes it extra sensitive.
						The reason being that if two consecutive keys are pressed very quickly, then fails to move in both
						directions. This code needs to be put in all the keys detection areas.*/
						clearTimeout(loopTimer);
						animate_(all_snakes,balls);
					}
					break;
			case user_con[1]:
					//top key 
					if(snake.yinc==0){
						snake.yinc=-1*YINC_CONST;
						snake.xinc=0;
						clearTimeout(loopTimer);
						animate_(all_snakes,balls);
					}
					break;
			case user_con[2]:
					//right key 
					if(snake.xinc==0){
						snake.yinc=0;
						snake.xinc=XINC_CONST;
						clearTimeout(loopTimer);
						animate_(all_snakes,balls);
					}
					break;
			case user_con[3]:
					//bottom key
					if(snake.yinc==0){
						snake.yinc=YINC_CONST;
						snake.xinc=0;
						clearTimeout(loopTimer);
						animate_(all_snakes,balls);
					}
					break;
			case 72:
					//this is the help key.H
					$("<div>Controls: <br/>(UP,RIGHT,DOWN,LEFT)<br/>P1:(&uarr; &rarr; &darr; &larr;) <br/> P2:(W D S A) <br/>Click for Pause/Play.<br/>Press P for Player2-Comp toggling.<br />Press H to see this again.</div>").appendTo("body").css({
						'position':'absolute',
						'top':'5px',
						'width':'50%',
						'left': '40%',
						'display': 'none',
						'font-family':'monospace',
						'font-size': '18px'
						}).fadeIn().delay(9000).fadeOut('slow');	
			default:
					break;
		}
	});
	/*
	if(index==0){
		$(document).bind("keydown",function(e){
					//this is for auto mode
					if(e.keyCode==80){
								var txt;
								if(auto==false){
									auto=true;
									txt="ON";
								}
								else{
									auto=false;
									txt="OFF";
								}
								$("<div>AUTO "+txt+"</div>").appendTo("body").css({
									'position':'absolute',
									'top': '23px',
									'right': '15px',
									'width': '40px',
									'display':'none',
									'font-family':'monospace',
									'font-size': '18px'
								}).fadeIn().delay(3000).fadeOut('slow');
					}

	});
	}
	*/
}
function get_directions(all_snakes,balls){
		var ball_pos=[balls.xpos,balls.ypos];
		//var s1_pos=[all_snakes[0].node_list[0].xpos,all_snakes[0].node_list[0].ypos];
		var s2_pos=[all_snakes[1].node_list[0].xpos,all_snakes[1].node_list[0].ypos];
		var s1_status=[all_snakes[1].xinc,all_snakes[1].yinc];
		//snake2 is the snake that we are going to automate
		var xdist=s2_pos[0]-ball_pos[0];
		var ydist=s2_pos[1]-ball_pos[1];
		var fin_res=[0,0];
		//This is for obtaining the next step.
		if(s1_status[0]!=0){		//s1_status[1]=0.
		//if here,Then the snake is moving horizontally
			if(s1_status[0]<0){
				// the snake is moving from right to left
				
				fin_res[0]=-1*XINC_CONST;
			}
			else{
					fin_res[0]=XINC_CONST;
			}
			if(xdist==0){
				fin_res[0]=0;
				//these considerations are for the shortest path.
				if(ydist>0){
					if(ydist<=(C_HEIGHT/2)){
						fin_res[1]=-1*YINC_CONST;			
					}
					else{
						fin_res[1]=YINC_CONST;
					}
				}
				else{
					if((Math.abs(ydist))<=(C_HEIGHT/2)){
						fin_res[1]=YINC_CONST;
					}
					else{
						fin_res[1]=-1*YINC_CONST;
					}
				}
			}
		}
		else{						//s1_status[0]=0... because both the xinc and yinc cant be zero together
		//if here,Then the snake is moving vertically
			if(s1_status[1]<0){
				
				fin_res[1]=-1*YINC_CONST;
			}
			else{
					fin_res[1]=YINC_CONST;
			}
			if(ydist==0){
				fin_res[1]=0;
				//Shortest path considerations
				if(xdist>0){
					//fin_res[0]=-1*XINC_CONST;			
					if(xdist<=(C_WIDTH/2)){
						fin_res[0]=-1*XINC_CONST;			
					}
					else{
						fin_res[0]=XINC_CONST;
					}
				}
				else{
					//fin_res[0]=XINC_CONST;
					if((Math.abs(xdist))<=(C_WIDTH/2)){
						fin_res[0]=XINC_CONST;
					}
					else{
						fin_res[0]=-1*XINC_CONST;
					}
				}
			}
		}
		//---------------------Intra snake collision aversion----------------------------
		var size_=all_snakes[1].node_list.length;
		var i,conflict,count=0;
		var x_try=0,y_try=0;
		do{
			conflict=false;
			//var pre_pos=[s2_pos[0]+fin_res[0],s2_pos[1]+fin_res[1]];
			var pre_pos=[];
			var x;
			if(fin_res[0]>=0){
				pre_pos.push((s2_pos[0]+fin_res[0])%C_WIDTH);				
			}
			else{
				x=s2_pos[0]+fin_res[0];
				if(x<=0){
					x=C_WIDTH+x;		// unsure...................
				}
				pre_pos.push(x);
			}
			if(fin_res[1]>=0){
				pre_pos.push((s2_pos[1]+fin_res[1])%C_HEIGHT);				
			}
			else{
				x=s2_pos[1]+fin_res[1];
				if(x<=0){
					x=C_HEIGHT+x;		// unsure...................
				}
				pre_pos.push(x);
			}
			
			for(i=1;i<size_;i++){
				if((all_snakes[1].node_list[i].xpos==pre_pos[0])&&(all_snakes[1].node_list[i].ypos==pre_pos[1])){
					conflict=true;
					break;
				}
			}
			if(conflict==true){
				count++;
				if(x_try!=0&&y_try!=0){
					if(fin_res[1]==0){
						fin_res[0]=0;
						if(y_try==1){
							fin_res[1]=-1*YINC_CONST;
						}
						else{
							fin_res[1]=YINC_CONST;
						}
					}
					else{
						fin_res[1]=0;
						if(x_try==1){
							fin_res[0]=-1*XINC_CONST;
						}
						else{
							fin_res[0]=XINC_CONST;
						}
					}
				}
				else{
					if(fin_res[1]==0){
						fin_res[0]=0;
						if(ydist>0){
							fin_res[1]=-1*YINC_CONST;
							y_try=-1;
						}
						else{
							fin_res[1]=YINC_CONST;
							y_try=1;
						}
					}
					else{	//fin_res[0]==0
						fin_res[1]=0;
						if(xdist>0){
							fin_res[0]=-1*XINC_CONST;
							x_try=-1;
						}
						else{
							fin_res[0]=XINC_CONST;
							x_try=1;
						}
					}	
				}
			}
			if(count==20){conflict=false;}	//this is to prevent infinite loops
		}while(conflict==true);
		//----------------------------------------------------------------------------------
		
		all_snakes[1].xinc=fin_res[0];
		all_snakes[1].yinc=fin_res[1];
		return all_snakes[1];
}
function auto_mode(all_snakes,balls){
	$(document).bind("keydown",function(e){
					//this is for auto mode
					if(e.keyCode==80){
								var txt;
								$(document).unbind("keydown");
								user_controls(all_snakes,0,user1,balls);
								if(auto==false){									
									auto=true;
									txt="ON";
								}
								else{
									user_controls(all_snakes,1,user2,balls);
									auto=false;
									txt="OFF";
								}
								auto_mode(all_snakes,balls);
								$("<div>AUTO "+txt+"</div>").appendTo("body").css({
									'position':'absolute',
									'top': '28px',
									'right': '13px',
									'width': '45px',
									'display':'none',
									'background-color':'#FFF',
									'font-family':'monospace',
									'border':'1px solid #000000',
									'padding':'0px',
									'font-size': '18px',
									'text-align': 'center'
								}).fadeIn().delay(3000).fadeOut('slow');
					}

	});
}
