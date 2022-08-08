function getRandomValue(min,max){
    //  Formula to calculate a random number between 2 numbers 
    return Math.floor(Math.random() * (max - min)) + min
}
const app = Vue.createApp({
    data(){
        return{
            playerHealth : 100,
            playerMana: 100,
            monsterHealth : 100,
            currentRound: 0,
            winner: null,
            cooldown: null,
            logMessages: []
        };
    },
    computed:{
        monsterBarStyles(){
            if (this.monsterHealth < 0){
                return {width:'0%'}
            }
            return {width: this.monsterHealth + '%'};
        },
        playerBarStyles(){
            if (this.playerHealth < 0){
                return {width:'0%'}
            }
            return {width: this.playerHealth + '%'};
        },
        mayUseSpecialAttack(){
            // return this.currentRound % 3 !== 0;
            return this.cooldown != null
        },
        mayUseHeal(){
            return this.playerMana <= 18;
        },
        playerManaBarStyle(){
            if (this.playerMana < 0){
                return {width:'0%'}
            }
            return {width: this.playerMana + '%'};
        },
 
    },
    watch:{
        playerHealth(value){
            if (value <= 0 && this.monsterHealth <=0){
            this.winner = "draw"
            }
            else if(value<=0)
            {
            this.winner = "monster"
            }
        },
        monsterHealth(value){
            if ( value <= 0 && this.playerHealth <=0 ){
                this.winner = "draw"
            }
            else if (value<=0){
                this.winner = "player"
            }
        },
        cooldown(value){
        if (value === 0)
        this.cooldown = null
        }
    },
    methods:{
        startGame(){
            this.playerHealth = 100;
            this.playerMana = 100;
            this.monsterHealth = 100;
            this.winner = null;
            this.cooldown =  null;
            this.currentRound = 0;
            this.logMessages = []

        },
        surrender(){
            this.winner = "monster"
        },
        attackMonster(){
            this.currentRound++;
            const attackValue = getRandomValue(5,12);
            //Same way of doing this
            // this.monsterHealth = this.monsterHealth - attackValue
            this.monsterHealth -= attackValue;
            this.addLogMessage("player","attack",attackValue)
            this.playerMana + 13 > 100 ? this.playerMana = 100 :  this.playerMana += 13
            this.attackPlayer();
            if ( this.cooldown != null)
            this.cooldown--;
            
        },
        attackPlayer(){
            const attackValue = getRandomValue(8,15);
            this. playerHealth -= attackValue;
            this.addLogMessage("monster","attack",attackValue)
        },
        specialAttackMonster(){
            this.currentRound++;
            this.cooldown = 3 ;
            this.playerMana -= 20
            const attackValue = getRandomValue(10,25);
            this.monsterHealth -= attackValue;
            this.addLogMessage("player","attack",attackValue)
            this.attackPlayer();
        },
        healPlayer(){
            this.currentRound++;
            const healValue = getRandomValue(8,20);
            if (this.playerHealth + healValue > 100){
                this.playerHealth = 100;
                this.playerMana -= 18

            }
            else
            {
                this.playerHealth += healValue;
                this.playerMana -= 18

            }
            this.addLogMessage("player","heal",healValue)
            if ( this.cooldown != null)
            this.cooldown--;

            this.attackPlayer();
        },
        addLogMessage(who, what, value){
            this.logMessages.unshift({
                actionBy : who,
                actionType: what,
                actionValue : value
            })
        }
    }
})


app.mount("#game")