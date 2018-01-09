//Execute this cod when DOM has fully loaded
$(document).ready(function() {
	var characters = {
		"Obi-Wan Kenobi": {
			name: "Obi-Wan Kenobi",
			health: 120,
			attack: 8,
			imageUrl: "assets/images/obi-wan.jpg",
			enemyAttackBack:15
		},
		"Luke Skywalker": {
			name: "Luke Skywalker",
			health: 100,
			attack: 14,
			imageUrl: "assets/images/luke-skywalker.png",
			enemyAttackBack:5
		},
		"Darth Sidious": {
			name: "Darth Sidious",
			health: 150,
			attack: 8,
			imageUrl: "assets/images/darth-sidious.png",
			enemyAttackBack:5
		},
		"Darth Maul": {
			name: "Darth Maul",
			health: 180,
			attack: 7,
			imageUrl: "assets/images/darth-maul.jpg",
			enemyAttackBack:25
		}
	};
	var currSelectedCharacter;
	var combatants=[];
	var currDefender;
	var turnCounter = 1;
	var killCount = 0;

	var renderOne = function(character, renderArea, charStatus) {
		var charDiv = $("<div class='character' data-name='" + character.name + "'>");
		var charName = $("<div class='character-name'>").text(character.name);
		var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
		charDiv.append(charName).append(charImage).append(charHealth);
		var charHealth = $("<div class='character-health'>").text(character.health);
		$(renderArea).append(charDiv);

		if(charStatus==="enemy") {
			$(charDiv).addClass("enemy");
		}
		else if (charStatus==="defender") {
			currDefender= character;
			$(charDiv).addClass("target-enemy");
		}
 	};

 	var renderMessage = function(message){
 		var gameMessageSet = $("#game-message");
 		var newMessage = $("<div>").text(message);
 		gameMessageSet.append(newMessage);

 		if(message=== "clearMessage"){
 			gameMessageSet.text("");
 		}
 	}

	var renderCharacters = function(charObj, areaRender) {
		if (areaRender === "#characters-section") {
			$(areaRender).empty();
			for (var key in charObj) {
				if(charObj.hasOwnProperty(key)) {
					renderOne(charObj[key], areaRender, "");
				}
			}
		}

		if (areaRender === "#selected-character") {
			renderOne(charObj, areaRender, "");
		}
		if(areaRender === "#available-to-attack-section"){
			for(var i=0; i < charObj.length; i++) {
				renderOne(charObj[i], areaRender, "");
			}

			$(document).on("click",".enemy", function(){
				var name = ($(this).attr("data-name"));
				if ($("#defender").children().length===0) {
					renderCharacters(name,"#defender");
					$(this).hide();
				}
			});
		}

		if (areaRender==="#defender") {
			$(areaRender).empty();
			for (var i = 0; i< combatants.length; i++) {
				if(combatants[i].name === charObj) {
					renderOne(combatants[i], areaRender, "defender");
				}
			}
		}

		if(areaRender === "playerDamage"){
			$("#defender").empty();
			renderOne(charObj, "#defender", "defender");
		}
		if(areaRender==="enemyDamage") {
			$("#selected-character").empty();
			renderOne(charObj, "#selected-character", "");
		}
		if (areaRender==="enemyDefeated"){
			$("#defender").empty();
		}
	};



	renderCharacters(characters, "#characters-section");

	$(document).on("click", ".character", function(){
		var name= $(this).attr("data-name");
		console.log(name);

		if(!currSelectedCharacter) {
			currSelectedCharacter=characters[name];
			for (var key in characters){
				if (key !== name){
					combatants.push(characters[key]);
				}
			}

			$("#characters-section").hide();
			renderCharacters(currSelectedCharacter, "#selected-character");
			renderCharacters(combatants, "#available-to-attack-section");
		}
	});

	$("#attack-button").on("click",function(){

		if ($("#defender").children().length !==0){
			currDefender.health -= (currSelectedCharacter.attack * turnCounter);
			if(currDefender.health>0){
				renderCharacters(currDefender, "playerDamage");
				currSelectedCharacter.health -= currDefender.enemyAttackBack;
				renderCharacters(currSelectedCharacter, "enemyDamage");
			}
			else{
				renderCharacters(currDefender, "enemyDefeated");
				killCount++;
				if (killCount>=3){

				}
			}
		}
		turnCounter++;
	})
});