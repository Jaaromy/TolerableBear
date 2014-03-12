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

    AgentServiceFactory.createAgent = function (stage, name, velocity) {
        var agent = KineticService.circle(UtilityService.randomInt(40, stage.getWidth() - 40), UtilityService.randomInt(40, stage.getHeight() - 40), 15);
        agent.aname = name ? name : agents.length + 1;
        agent.velocity = velocity;
        agent.position = new Vec2(agent.getX(), agent.getY());
        agent.setPos = function (x, y) {
            this.position.x = x;
            this.position.y = y;
            this.setX(x);
            this.setY(y);
        };
        agent.mass = 10;

        agent.checkCollision = function (agent) {
            var dist = this.position.dist(agent.position);
            if (dist < this.radius() + agent.radius()) {
                var normalPlane = this.position.subV(agent.position);
                normalPlane.normalize();
                var collisionPlane = new Vec2(-normalPlane.x, normalPlane.y);

                //var n_vel1 = Vector2.Dot(normalPlane, object1.Velocity);
                //var c_vel1 = Vector2.Dot(collisionPlane, object1.Velocity);
                //var n_vel2 = Vector2.Dot(normalPlane, object2.Velocity);
                //var c_vel2 = Vector2.Dot(collisionPlane, object2.Velocity);
                var n_vel1 = normalPlane.dot(this.velocity);
                var c_vel1 = collisionPlane.dot(this.velocity);
                var n_vel2 = normalPlane.dot(agent.velocity);
                var c_vel2 = collisionPlane.dot(agent.velocity);

                //var n_vel1_after = ((n_vel1 * (object1.Mass - object2.Mass)) + (2 * object2.Mass * n_vel2)) / (object2.Mass + object1.Mass);
                //var n_vel2_after = ((n_vel2 * (object2.Mass - object1.Mass)) + (2 * object1.Mass * n_vel1)) / (object2.Mass + object1.Mass);
                var n_vel1_after = ((n_vel1 * (this.mass - agent.mass)) + (2 * agent.mass * n_vel2)) / (agent.mass + this.mass);
                var n_vel2_after = ((n_vel2 * (agent.mass - this.mass)) + (2 * this.mass * n_vel1)) / (agent.mass + this.mass);

                //Vector2 vec_n_vel2_after = n_vel2_after * normalPlane;
                //Vector2 vec_c_vel2 = c_vel2 * collisionPlane;
                //Vector2 vec_n_vel1_after = n_vel1_after * normalPlane;
                //Vector2 vec_c_vel1 = c_vel1 * collisionPlane;
                var vec_n_vel2_after = normalPlane.mulS(n_vel2_after);
                var vec_c_vel2 = collisionPlane.mulS(c_vel2);
                var vec_n_vel1_after = normalPlane.mulS(n_vel1_after);
                var vec_c_vel1 = collisionPlane.mulS(c_vel1);

                //Vector2 vel1_after = vec_n_vel1_after + vec_c_vel1;
                //Vector2 vel2_after = vec_n_vel2_after + vec_c_vel2;
                var vel1_after = vec_n_vel1_after.addV(vec_c_vel1);
                var vel2_after = vec_n_vel2_after.addV(vec_c_vel2);

                this.velocity.x = vel1_after.x;
                this.velocity.y = vel1_after.y;
                var vel = this.velocity;
            }
        };

        addAgent(agent);
        if (layers.length === 0) {
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

    AgentServiceFactory.setVelocity = function (name, velocity) {
        var agent = AgentServiceFactory.getAgent(name);
        if (agent) {
            agent.velocity.x = velocity.x;
            agent.velocity.y = velocity.y;
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

    AgentServiceFactory.checkAllCollisions = function () {
        for (var i = 0; i < agents.length; i++) {
            for (var j = 0; j < agents.length; j++) {
                if (i != j) {
                    agents[i].checkCollision(agents[j]);
                }
            }
        }
    };

    AgentServiceFactory.checkBoundary = function (name, xBound, yBound) {
        var agent = AgentServiceFactory.getAgent(name);
        if (agent) {
            if (agent.getX() + agent.radius() > xBound || agent.getX() - agent.radius() < 0) {
                agent.velocity.x *= -1;
            }

            if (agent.getY() + agent.radius() > yBound || agent.getY() - agent.radius() < 0) {
                agent.velocity.y *= -1;
            }
        }
    };

    AgentServiceFactory.moveAgent = function (name) {
        var agent = AgentServiceFactory.getAgent(name);
        if (agent) {
            var newPos = agent.position.addV(agent.velocity);
            agent.setPos(newPos.x, newPos.y);
        }
    };

    AgentServiceFactory.clear = function () {
        agents = [];
        layers = [];
    };

    AgentServiceFactory.drawAllLayers = function () {
        for (var i = 0; i < layers.length; i++) {
            layers[i].draw();
        }
    };

    return AgentServiceFactory;
});