angular.module('MyModule').factory('AgentService', function ($window, KineticService) {
   'use strict';
   var AgentServiceFactory = {};

   var stage = KineticService.createStage('container', 640, 480);
   var agents = [];
   var layers = [];

   AgentServiceFactory.getCanvasWidth = function () {
      return stage.getWidth();
   };

   AgentServiceFactory.getCanvasHeight = function () {
      return stage.getHeight();
   };

   AgentServiceFactory.createAgent = function (name) {
      var agent = KineticService.circle(50,50, 15);
      agent.aname = name ? name : layers.length + 1;
      var layer = KineticService.layer(agent);
      stage.add(layer);

      agents.push(agent);
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