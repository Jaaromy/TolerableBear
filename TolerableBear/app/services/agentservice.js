angular.module('MyModule').factory('AgentService', function ($window, KineticService, UtilityService) {
   'use strict';
   var AgentServiceFactory = {};

   var agents = [];
   var layers = [];

   function removeLayer(agent) {
      for (var i = 0; i < layers.length; i++) {
         for (var j = 0; j < layers[i].children.length; j++) {
            if (layers[i].children[j].aname && layers[i].children[j].aname === agent.aname) {
               //Remove layer from stage.
               layers[i].remove();
               //Remove layer from list.
               layers.splice(i, 1);
               return;
            }
         }
      }
   }

   function removeAgent(agent) {
      if (agent && agent.aname) {
         //Remove from layer.
         agent.remove();
         for (var i = 0; i < agents.length; i++) {
            if (agents[i].aname === agent.aname) {
               agents.splice(i, 1);
               return;
            }
         }
      }
   }

   function addAgent(agent) {
      if (agent) {
         removeAgent(agent);
         agents.push(agent);
         return agent;
      }
   }

   function addLayer(layer, agent) {
      if (layer) {
         removeLayer(agent);
         layers.push(layer);
      }
   }

   AgentServiceFactory.createAgent = function (stage, name, direction, velocity) {
      var agent = KineticService.circle(UtilityService.randomInt(30, stage.getWidth() - 30), UtilityService.randomInt(30, stage.getHeight() - 30), 15);
      agent.aname = name ? name : agents.length + 1;
      agent.direction = direction;
      agent.velocity = velocity;

      addAgent(agent);
      if (layers.length == 0) {
         layers.push(KineticService.layer());
      }

      layers[layers.length - 1].add(agent);

      if (stage.children.length === 0) {
         stage.add(layers[0]);
      }

      //addLayer(layer, agent);
      //layers.push(layer);
   };

   AgentServiceFactory.getAgent = function (name) {
      if (name) {
         for (var i = 0; i < agents.length; i++) {
            if (agents[i].aname === name) {
               return agents[i];
            }
         }
      }

      return null;
   };

   AgentServiceFactory.setDirection = function (name, direction, velocity) {
      var agent = AgentServiceFactory.getAgent(name);
      if (agent) {
         agent.direction = direction;
         agent.velocity = velocity;
      }
   };
   
   AgentServiceFactory.moveAllAgents = function () {
      for (var i = 0; i < agents.length; i++) {
         AgentServiceFactory.moveAgent(agents[i].aname);
      }
   };

   AgentServiceFactory.checkAllBoundaries = function (xBound, yBound) {
      for (var i = 0; i < agents.length; i++) {
         AgentServiceFactory.checkBoundary(agents[i].aname, xBound, yBound);
      }
   };

   AgentServiceFactory.checkBoundary = function (name, xBound, yBound) {
      var agent = AgentServiceFactory.getAgent(name);
      if (agent) {
         if (agent.getX() + agent.radius() > xBound || agent.getX() - agent.radius() < 0) {
            agent.direction.x *= -1;
         }

         if (agent.getY() + agent.radius() > yBound || agent.getY() - agent.radius() < 0) {
            agent.direction.y *= -1;
         }
      }
   };

   AgentServiceFactory.moveAgent = function (name) {
      var agent = AgentServiceFactory.getAgent(name);
      if (agent) {
         var deltaVec = agent.direction.mulS(agent.velocity);
         agent.setX(agent.getX() + deltaVec.x);
         agent.setY(agent.getY() + deltaVec.y);
      }
   };

   AgentServiceFactory.drawAllLayers = function () {
      for (var i = 0; i < layers.length; i++) {
         layers[i].draw();
      }
   };

   return AgentServiceFactory;
});