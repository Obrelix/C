import { getObjectsByPrototype } from 'game/utils';
import { Creep, StructureSpawn,  } from 'game/prototypes';
import { ERR_NOT_IN_RANGE, ATTACK, RANGED_ATTACK, HEAL, WORK, MOVE, CARRY } from 'game/constants';
// @ts-ignore
import { prototypes, utils, constants } from 'game';

var creepHarvester, creepAttacker, creepRangeAttacker;
export function loop() {
    var source = utils.getObjectsByPrototype(prototypes.Source)[0];
    var spawn = utils.getObjectsByPrototype(prototypes.StructureSpawn).find(i => i.my);
    if(!creepHarvester) {
        creepHarvester = spawn.spawnCreep([MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,WORK,WORK]).object;
    }else {
        if(creepHarvester.store.getFreeCapacity(constants.RESOURCE_ENERGY)) {
            if(creepHarvester.harvest(source) == constants.ERR_NOT_IN_RANGE) {
                creepHarvester.moveTo(source);
            }
        } else {
            if(creepHarvester.transfer(spawn, constants.RESOURCE_ENERGY) == constants.ERR_NOT_IN_RANGE) {
                creepHarvester.moveTo(spawn);
            }
        }
        if(!creepAttacker) {
            creepAttacker = spawn.spawnCreep([MOVE,MOVE,ATTACK,ATTACK]).object;
        } else {
            if(!creepRangeAttacker) {
                creepRangeAttacker = spawn.spawnCreep([MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK]).object;
            } else {
                // creep2.moveTo(flags[1]);
            }
        }
    }
    var myCreeps = getObjectsByPrototype(Creep).filter(creep => creep.my);
    var enemyCreep = getObjectsByPrototype(Creep).find(creep => !creep.my);
    for(var creep of myCreeps) {
        if(creep.body.some(bodyPart => bodyPart.type == ATTACK)) {
            if(creep.attack(enemyCreep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemyCreep);
            }
        }
        if(creep.body.some(bodyPart => bodyPart.type == RANGED_ATTACK)) {
            if(creep.rangedAttack(enemyCreep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemyCreep);
            }
        }
        if(creep.body.some(bodyPart => bodyPart.type == HEAL)) {
            var myDamagedCreeps = myCreeps.filter(i => i.hits < i.hitsMax);
            if(myDamagedCreeps.length > 0) {
                if(creep.heal(myDamagedCreeps[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(myDamagedCreeps[0]);
                }
            }
        }
        if(creep.body.some(bodyPart => bodyPart.type == WORK)){

        }
    }
}
