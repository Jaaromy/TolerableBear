angular.module('MyModule').factory('AgentService', function ($window, KineticService) {
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

   AgentServiceFactory.createAgent = function (stage, name) {
      var agent = KineticService.circle(50,50, 15);
      agent.aname = name ? name : layers.length + 1;

      addAgent(agent);
      var layer = KineticService.layer(agent);
      addLayer(layer, agent);
      stage.add(layer);
      layers.push(layer);
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

   AgentServiceFactory.moveAgent = function (dX, dY, name) {
      var agent = AgentServiceFactory.getAgent(name);
      if (agent) {
         agent.setX(agent.getX() + dX);
         agent.setY(agent.getY() + dY);
      }
   };

   AgentServiceFactory.drawAllLayers = function () {
      for (var i = 0; i < layers.length; i++) {
         layers[i].draw();
      }
   };

   return AgentServiceFactory;
});