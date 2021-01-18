//last time we checked. 
var lastChecked;

//canvas
var canvas;
var ctx;

// notifs to be displayed
var pendingArray = [];

//if true, show the last popup in array
var bNotShowingPopup = true;


function RenderCanvas()
{
	//console.log("hi");

	if(bNotShowingPopup && pendingArray.length > 0)
	{
		var pending = pendingArray.pop();

		var img = new Image();

		//load the image first then everything else load in the onload
		img.onload = function()
		{
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			//ctx.fillStyle = BackgroundColour;
			//ctx.fillRect(0, 0, 600, 130);
			var bgimg = document.getElementById("bg");
			ctx.drawImage(bgimg, 0, 0);


			document.getElementById("demoCanvas").style.opacity = 1;
			ctx.drawImage(img, 33, 33);


			//static
			//ctx.globalAlpha = 0.5;
			ctx.fillStyle = LabelColour;
			ctx.font = "12px Rubik";
			ctx.fillText("Achievement Unlocked - " + pending.GameTitle, 80, 16);
			//ctx.globalAlpha = 1;


			//Title
			ctx.fillStyle = TitleColour;
			ctx.font = "22px Rubik-Bold";
			wrapText(ctx, pending.Title, 110, 50, 286, 20);
			//ctx.fillText(pending.Title, 110, 50);

			//Desc
			ctx.fillStyle = DescColour;
			ctx.font = "16px Rubik";
			wrapText(ctx, pending.Description, 110, 90, 270, 16);
			//ctx.fillText(pending.Description, 95, 90);

			//GameName
			//ctx.font = "12px Arial";
			//ctx.fillText(pending.GameTitle, 95, 100);

			//ctx.drawImage(img, 10, 10);
		};
		img.src = 'https://retroachievements.org' + pending.BadgeURL;
		

		//call fade out anim on canvas
		setTimeout(function()
		{
			fadeOutEffect();
	
		},fadeOutTime*1000);


		bNotShowingPopup = false;


		var audio = new Audio('sound/notif.mp3');
		audio.play();
		//console.log("looped");
	}

	window.requestAnimationFrame(RenderCanvas);
}


//this checks for any new achievements from LastChecked date til Now date.
function UpdateTick()
{
	var nowStr = ''+Date.now();
	nowStr = nowStr.slice(0, 10);



	$.getJSON('https://retroachievements.org/API/API_GetAchievementsEarnedBetween.php?z='+ UserName +'&y='+ API_Key +'&u='+ UserName +'&f=' + lastChecked + '&t='+nowStr, function(data)
	{
		//JSON result in `data` variable - 1599609600

		if(data.length > 0)
		{
			for (var key in data)
			{
				pendingArray.push(data[key]);
				//console.log(data[key]);
			}

			//console.log(pendingArray);
		}

		lastChecked = nowStr;
		//console.log("checked");
	});
}


function fadeOutEffect()
{
    var fadeTarget = document.getElementById("demoCanvas");
	var fadeEffect = setInterval(function ()
	{
		if (!fadeTarget.style.opacity)
		{
            fadeTarget.style.opacity = 1;
		}
		
		if (fadeTarget.style.opacity > 0)
		{
            fadeTarget.style.opacity -= 0.05;
		}
		else
		{
			clearInterval(fadeEffect);
			
			//call check for another notid popup
			bNotShowingPopup = true;
        }
    }, 16);
}


//not used
function fadeInEffect()
{
    var fadeTarget = document.getElementById("demoCanvas");
	var fadeEffect = setInterval(function ()
	{
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.05;
        } else {
            clearInterval(fadeEffect);
        }
    }, 16);
}


function updateNotifInfo(title, text, console)
{
	
	ctx.font = "30px Arial";
	ctx.fillText(title, 10, 50);

	ctx.fillText(text, 10, 50);
}


window.addEventListener("load", function()
{
	document.getElementById("demoCanvas").style.opacity = 0;
	canvas = document.getElementById("demoCanvas");
	ctx = canvas.getContext("2d");

	//hack to pre-load font
	ctx.globalAlpha = 0.0;
	ctx.font = "12px Rubik";
	ctx.fillText("loading font...", 80, 16);
	ctx.font = "12px Rubik-Bold";
	ctx.fillText("loading font...", 80, 16);
	ctx.globalAlpha = 1;
	//hack end

	var dateNum = Date.now()-1000;
	var nowStr = ''+dateNum;
	
	lastChecked = nowStr.slice(0, 10);

	//get achivments from api, and update pendingArray
	//setInterval
	setInterval(function()
	{
		UpdateTick();

	},updateTime*1000);


	window.requestAnimationFrame(RenderCanvas);
});


function wrapText(context, text, x, y, maxWidth, lineHeight)
{
	var words = text.split(' ');
	var line = '';

	for(var n = 0; n < words.length; n++)
	{
		var testLine = line + words[n] + ' ';
		var metrics = context.measureText(testLine);
		var testWidth = metrics.width;

		if (testWidth > maxWidth && n > 0)
		{
			context.fillText(line, x, y);
			line = words[n] + ' ';
			y += lineHeight;
		}
		else
		{
			line = testLine;
		}
	}
	context.fillText(line, x, y);
}