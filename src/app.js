var HelloWorldLayer = cc.Layer.extend({
    sprFondo:null,
    sprConejo:null,
    scoreValue: 0,
    scoreLabel: null,
    bombs: [],
    carrots : [],
    
    random: function getRandomInt(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	},
    
    moveBunny: function(location, event){
		var  game = event.getCurrentTarget();
		var locate = location.getLocation();
        
        if(locate.x > 675){
            locate.x = 674;
        }
        else if(locate.x < 280){
            locate.x = 281;
        }
        
		game.sprConejo.setPosition(locate.x, 98);
	},
    
    createBomb: function(){
		var bomb = new cc.Sprite(res.bomba_png);
        var xPos = this.random(275,690);
        bomb.setPosition(xPos, 800);
        this.addChild(bomb, 1);
		var moveto = cc.moveTo(this.random(2,5), xPos, 60);
		bomb.runAction(moveto);
		this.bombs.push(bomb);
        var rectBomb = bomb.getBoundingBox();
	},
    
    createCarrot: function(){
		var carrot = new cc.Sprite(res.carrot_png);
        var xPos = this.random(280,700);
        carrot.setPosition(xPos, 800);
        this.addChild(carrot, 1);
		var moveto = cc.moveTo(this.random(2,5), xPos, 70);
		carrot.runAction(moveto);
		this.carrots.push(carrot);		
	},
    
    kill: function(){
		for(var bomb of this.bombs){
            var rectBomb = bomb.getBoundingBox();
            var rectBunny = this.sprConejo.getBoundingBox();
            
            if(cc.rectIntersectsRect(rectBomb, rectBunny)){
                bomb.setVisible(false);
                bomb.setPosition(0,0);
                this.gameOver();
            }
            
            if(bomb.getPositionY() < 65){
                bomb.setVisible(false);
                bomb.setPosition(0,0);
            }
            
		}
		return true;	
	},
    
    score: function(){
		for(var carrot of this.carrots){
            var rectCarrot = carrot.getBoundingBox();
            var rectBunny = this.sprConejo.getBoundingBox();
            
            if(cc.rectIntersectsRect(rectCarrot, rectBunny)){
                carrot.setVisible(false);
                carrot.setPosition(0,0);
                this.scoreValue += 1;
                this.scoreLabel.setString("Score: " + this.scoreValue);
            }
            
            if(carrot.getPositionY() < 75){
                carrot.setVisible(false);
                carrot.setPosition(0,0);
            }
		}
		return true;	
	},
    
    gameOver: function(){
        alert("Game Over!");
        this.scoreValue = 0;
        this.scoreLabel.setString("Score: " + this.scoreValue);
        
        var size = cc.winSize;
        this.sprConejo.setPosition(size.width / 2, size.height * 0.15);
        
        for(var bomb of this.bombs){
            bomb.setVisible(false);
            bomb.setPosition(0,0);
        }
        
        for(var carrot of this.carrots){
            carrot.setVisible(false);
            carrot.setPosition(0,0);
        }
        
        return true;
    },
    
    initiate: function(){
        return true;
    },
    
    ctor:function () {
        this._super();
        //Obteniendo el tamaño de la pantalla
        var size = cc.winSize;

        //posicionando la imagen de fondo
        this.sprFondo = new cc.Sprite(res.fondo_png);
        this.sprFondo.setPosition(size.width / 2,size.height / 2);
        this.addChild(this.sprFondo, 0);
        
        //posicionando la imagen del conejo
        this.sprConejo = new cc.Sprite(res.conejo_png);
        this.sprConejo.setPosition(size.width / 2,size.height * 0.15);
        this.addChild(this.sprConejo, 1);
        
        //score
        this.scoreLabel = new cc.LabelTTF("Score: " + this.scoreValue, "Heveltica", 24);
        this.scoreLabel.setPosition(660, 620);
        this.scoreLabel.setColor(0, 0, 0);
        this.addChild(this.scoreLabel, 2);
        
        //creacion enemigos/puntos
        this.schedule(this.createBomb, 1);
        this.schedule(this.createCarrot, 2);
        this.schedule(this.kill, 0, Infinity);
        this.schedule(this.score, 0, Infinity);
        
        //movimiento player
        cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.initiate,
			onTouchMoved: this.moveBunny
		}, this);
        
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

