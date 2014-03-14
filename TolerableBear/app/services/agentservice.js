angular.module('MyModule').factory('AgentService', function ($window, KineticService, UtilityService) {
    'use strict';
    var AgentServiceFactory = {};

    var agents = [];
    var layers = [];
    var selectedAgent = {};

    AgentServiceFactory.getSelected = function () {
        return selectedAgent;
    };

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

    AgentServiceFactory.updateFrequency = 20;
    AgentServiceFactory.pixelsPerMeter = 100;

    //Velocity is in m/s.
    //1 pixel == 1 centimeter
    //Must translate meter/second to centimeter/second and then apply frame factor for move.
    function updateFac() {
        return AgentServiceFactory.updateFrequency / 1000 * AgentServiceFactory.pixelsPerMeter;
    }

    AgentServiceFactory.createAgent = function (stage, name, startPos, velocity, radius) {
        var agent = KineticService.circle(startPos.x, startPos.y, radius);
        agent.aname = name ? name : agents.length + 1;
        agent.velocity = velocity;
        agent.position = new Vec2(agent.getX(), agent.getY());
        agent.setPos = function (x, y) {
            this.position.x = x;
            this.position.y = y;
            this.setX(x);
            this.setY(y);
        };
        agent.setListening(true);
        agent.on("click", function () {
            selectedAgent = this;
        });

        agent.mass = radius * radius;

        agent.checkCollision = function (agent) {
            // Calculate the difference between the two objects.
            //Vector2 difference = object1.Position - object2.Position;
            //float distanceAtFrameEnd = difference.Length();
            var difference = vMath.subV(this.position, agent.position);
            var distanceAtFrameEnd = vMath.length(difference);

            // Calculate the distance that a collision would occur at.
            //float collisionDistance = (object1.Diameter / 2f) + (object2.Diameter / 2f);
            var collisionDistance = this.radius() + agent.radius();

            // Check of the objects are closer that the collision distance.
            if (distanceAtFrameEnd < collisionDistance) {
                // Move both objects back to the exact point of collision.
                //var millisecondsAfterCollision = MoveBackToCollisionPoint(1, this, agent, distanceAtFrameEnd, collisionDistance);
                var millisecondsAfterCollision = 1;

                // Calculate the normal of the collision plane.
                //Vector2 normalPlane = difference;
                //normalPlane.Normalize();
                var normalPlane = vMath.normalize(difference);

                // Calculate the collision plane.
                //Vector2 collisionPlane = new Vector2(-normalPlane.Y, normalPlane.X);
                var collisionPlane = new Vec2( -normalPlane.y, normalPlane.x);

                // Calculate prior velocities relative the the collision plane and normal.
                //var n_vel1 = Vector2.Dot(normalPlane, object1.Velocity);
                //var c_vel1 = Vector2.Dot(collisionPlane, object1.Velocity);
                //var n_vel2 = Vector2.Dot(normalPlane, object2.Velocity);
                //var c_vel2 = Vector2.Dot(collisionPlane, object2.Velocity);
                var n_vel1 = vMath.dot(normalPlane, this.velocity);
                var c_vel1 = vMath.dot(collisionPlane, this.velocity);
                var n_vel2 = vMath.dot(normalPlane, agent.velocity);
                var c_vel2 = vMath.dot(collisionPlane, agent.velocity);

                // Calculate the scaler velocities of each object after the collision.
                //var n_vel1_after = ((n_vel1 * (object1.Mass - object2.Mass)) + (2 * object2.Mass * n_vel2)) / (object2.Mass + object1.Mass);
                //var n_vel2_after = ((n_vel2 * (object2.Mass - object1.Mass)) + (2 * object1.Mass * n_vel1)) / (object2.Mass + object1.Mass);
                var n_vel1_after = ((n_vel1 * (this.mass - agent.mass)) + (2 * agent.mass * n_vel2)) / (agent.mass + this.mass);
                var n_vel2_after = ((n_vel2 * (agent.mass - this.mass)) + (2 * this.mass * n_vel1)) / (agent.mass + this.mass);

                // Convert the scalers to vectors by multiplying by the normalised plane vectors.
                //Vector2 vec_n_vel2_after = n_vel2_after * normalPlane;
                //Vector2 vec_c_vel2 = c_vel2 * collisionPlane;
                //Vector2 vec_n_vel1_after = n_vel1_after * normalPlane;
                //Vector2 vec_c_vel1 = c_vel1 * collisionPlane;
                var vec_n_vel2_after = vMath.mulS(normalPlane, n_vel2_after);
                var vec_c_vel2 = vMath.mulS(collisionPlane, c_vel2);
                var vec_n_vel1_after = vMath.mulS(normalPlane, n_vel1_after);
                var vec_c_vel1 = vMath.mulS(collisionPlane, c_vel1);

                // Combine the vectors back into a single vector in world space.
                //Vector2 vel1_after = vec_n_vel1_after + vec_c_vel1;
                //Vector2 vel2_after = vec_n_vel2_after + vec_c_vel2;
                var vel1_after = vMath.addV(vec_n_vel1_after, vec_c_vel1);
                var vel2_after = vMath.addV(vec_n_vel2_after, vec_c_vel2);

                // Reapply the move-back from before the collision (using the post collision velocity)
                //Vector2 object1AdjustedPositionAfterCollision = object1.Position + vel1_after * millisecondsAfterCollision;
                //Vector2 object2AdjustedPositionAfterCollision = object2.Position + vel2_after * millisecondsAfterCollision;
                var object1AdjustedPositionAfterCollision = vMath.addV(this.position, vMath.mulS(vel1_after, millisecondsAfterCollision * updateFac()));
                var object2AdjustedPositionAfterCollision = vMath.addV(agent.position, vMath.mulS(vel2_after, millisecondsAfterCollision * updateFac()));

                // Set the objects new positions and velocities.
                //object1.SetState(object1AdjustedPositionAfterCollision, vel1_after);
                //object2.SetState(object2AdjustedPositionAfterCollision, vel2_after);
                this.position.x = object1AdjustedPositionAfterCollision.x;
                this.position.y = object1AdjustedPositionAfterCollision.y;
                agent.position.x = object2AdjustedPositionAfterCollision.x;
                agent.position.y = object2AdjustedPositionAfterCollision.y;

                this.velocity.x = vel1_after.x;
                this.velocity.y = vel1_after.y;

                agent.velocity.x = vel2_after.x;
                agent.velocity.y = vel2_after.y;
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

        selectedAgent = agent;
        //addLayer(layer, agent);
        //layers.push(layer);
    };

    function MoveBackToCollisionPoint(totalMilliseconds, object1, object2, distanceAtFrameEnd, collisionDistance) {
        // Calculate the position of each object at the start of the frame.
        //float object1PosAtFrameStart_X = (float)(object1.Position.X - object1.Velocity.X * frameDuration.TotalMilliseconds);
        //float object1PosAtFrameStart_Y = (float)(object1.Position.Y - object1.Velocity.Y * frameDuration.TotalMilliseconds);
        //Vector2 object1PosAtFrameStart = new Vector2(object1PosAtFrameStart_X, object1PosAtFrameStart_Y);
        //float object2PosAtFrameStart_X = (float)(object2.Position.X - object2.Velocity.X * frameDuration.TotalMilliseconds);
        //float object2PosAtFrameStart_Y = (float)(object2.Position.Y - object2.Velocity.Y * frameDuration.TotalMilliseconds);
        //Vector2 object2PosAtFrameStart = new Vector2(object2PosAtFrameStart_X, object2PosAtFrameStart_Y);
        var object1PosAtFrameStart_X = (object1.position.y - object1.velocity.x * totalMilliseconds);
        var object1PosAtFrameStart_Y = (object1.position.y - object1.velocity.y * totalMilliseconds);
        var object1PosAtFrameStart = new Vec2(object1PosAtFrameStart_X, object1PosAtFrameStart_Y);

        var object2PosAtFrameStart_X = (object2.position.x - object2.velocity.x * totalMilliseconds);
        var object2PosAtFrameStart_Y = (object2.position.y - object2.velocity.y * totalMilliseconds);
        var object2PosAtFrameStart = new Vec2(object2PosAtFrameStart_X, object2PosAtFrameStart_Y);

        // Calculate the distance between the objects at the start of the frame.
        //Vector2 differenceAtFrameStart = object2PosAtFrameStart - object1PosAtFrameStart;
        //float distanceAtFrameStart = differenceAtFrameStart.Length();
        var differenceAtFrameStart = vMath.subV(object2PosAtFrameStart, object1PosAtFrameStart);
        var distanceAtFrameStart = vMath.length(differenceAtFrameStart);

        // Calculate the total change in distance during the frame, and the required change to reach the collision.
        //float distanceTotalDelta = distanceAtFrameEnd - distanceAtFrameStart;
        //float distanceDeltaToCollision = collisionDistance - distanceAtFrameStart;
        var distanceTotalDelta = distanceAtFrameEnd - distanceAtFrameStart;
        var distanceDeltaToCollision = collisionDistance - distanceAtFrameStart;

        // Calculate the percentage change to the collision and after the collision.
        //float percentageDeltaToCollision = distanceDeltaToCollision / distanceTotalDelta;
        //float percentageDeltaAfterCollision = 1 - percentageDeltaToCollision;
        var percentageDeltaToCollision = distanceDeltaToCollision / distanceTotalDelta;
        var percentageDeltaAfterCollision = 1 - percentageDeltaToCollision;

        // Calculte the time before and after the collision in the frame.
        //double millisecondsToCollision = frameDuration.TotalMilliseconds * percentageDeltaToCollision;
        //float millisecondsAfterCollision = (float)(frameDuration.TotalMilliseconds * percentageDeltaAfterCollision);
        var millisecondsToCollision = totalMilliseconds * percentageDeltaToCollision;
        var millisecondsAfterCollision = (totalMilliseconds * percentageDeltaAfterCollision);

        // Calculate and move the objects to their positions at the point of collision.
        //float object1PosAtCollision_X = (float)(object1PosAtFrameStart_X + object1.Velocity.X * millisecondsToCollision);
        //float object1PosAtCollision_Y = (float)(object1PosAtFrameStart_Y + object1.Velocity.Y * millisecondsToCollision);
        //Vector2 object1PosAtCollision = new Vector2(object1PosAtCollision_X, object1PosAtCollision_Y);
        //object1.SetPosition(object1PosAtCollision);
        //float object2PosAtCollision_X = (float)(object2PosAtFrameStart_X + object2.Velocity.X * millisecondsToCollision);
        //float object2PosAtCollision_Y = (float)(object2PosAtFrameStart_Y + object2.Velocity.Y * millisecondsToCollision);
        //Vector2 object2PosAtCollision = new Vector2(object2PosAtCollision_X, object2PosAtCollision_Y);
        //object2.SetPosition(object2PosAtCollision);

        var object1PosAtCollision_X = (object1PosAtFrameStart_X + object1.velocity.x * millisecondsToCollision);
        var object1PosAtCollision_Y = (object1PosAtFrameStart_Y + object1.velocity.y * millisecondsToCollision);
        var object1PosAtCollision = new Vec2(object1PosAtCollision_X, object1PosAtCollision_Y);
        object1.position.x = object1PosAtCollision.x;
        object1.position.y = object1PosAtCollision.y;

        var object2PosAtCollision_X = (object2PosAtFrameStart_X + object2.velocity.x * millisecondsToCollision);
        var object2PosAtCollision_Y = (object2PosAtFrameStart_Y + object2.velocity.y * millisecondsToCollision);
        var object2PosAtCollision = new Vec2(object2PosAtCollision_X, object2PosAtCollision_Y);
        object2.position.x = object2PosAtCollision.x;
        object2.position.y = object2PosAtCollision.y;

        return millisecondsAfterCollision;
    }

    //private static float MoveBackToCollisionPoint(TimeSpan frameDuration, ICollidableCircle object1, ICollidableCircle object2, float distanceAtFrameEnd, float collisionDistance)
    //{
    //    // Calculate the position of each object at the start of the frame.
    //    float object1PosAtFrameStart_X = (float)(object1.Position.X - object1.Velocity.X * frameDuration.TotalMilliseconds);
    //    float object1PosAtFrameStart_Y = (float)(object1.Position.Y - object1.Velocity.Y * frameDuration.TotalMilliseconds);
    //    Vector2 object1PosAtFrameStart = new Vector2(object1PosAtFrameStart_X, object1PosAtFrameStart_Y);

    //    float object2PosAtFrameStart_X = (float)(object2.Position.X - object2.Velocity.X * frameDuration.TotalMilliseconds);
    //    float object2PosAtFrameStart_Y = (float)(object2.Position.Y - object2.Velocity.Y * frameDuration.TotalMilliseconds);
    //    Vector2 object2PosAtFrameStart = new Vector2(object2PosAtFrameStart_X, object2PosAtFrameStart_Y);

    //    // Calculate the distance between the objects at the start of the frame.
    //    Vector2 differenceAtFrameStart = object2PosAtFrameStart - object1PosAtFrameStart;
    //    float distanceAtFrameStart = differenceAtFrameStart.Length();

    //    // Calculate the total change in distance during the frame, and the required change to reach the collision.
    //    float distanceTotalDelta = distanceAtFrameEnd - distanceAtFrameStart;
    //    float distanceDeltaToCollision = collisionDistance - distanceAtFrameStart;

    //    // Calculate the percentage change to the collision and after the collision.
    //    float percentageDeltaToCollision = distanceDeltaToCollision / distanceTotalDelta;
    //    float percentageDeltaAfterCollision = 1 - percentageDeltaToCollision;

    //    // Calculte the time before and after the collision in the frame.
    //    double millisecondsToCollision = frameDuration.TotalMilliseconds * percentageDeltaToCollision;
    //    float millisecondsAfterCollision = (float)(frameDuration.TotalMilliseconds * percentageDeltaAfterCollision);

    //    // Calculate and move the objects to their positions at the point of collision.
    //    float object1PosAtCollision_X = (float)(object1PosAtFrameStart_X + object1.Velocity.X * millisecondsToCollision);
    //    float object1PosAtCollision_Y = (float)(object1PosAtFrameStart_Y + object1.Velocity.Y * millisecondsToCollision);
    //    Vector2 object1PosAtCollision = new Vector2(object1PosAtCollision_X, object1PosAtCollision_Y);
    //    object1.SetPosition(object1PosAtCollision);

    //    float object2PosAtCollision_X = (float)(object2PosAtFrameStart_X + object2.Velocity.X * millisecondsToCollision);
    //    float object2PosAtCollision_Y = (float)(object2PosAtFrameStart_Y + object2.Velocity.Y * millisecondsToCollision);
    //    Vector2 object2PosAtCollision = new Vector2(object2PosAtCollision_X, object2PosAtCollision_Y);
    //    object2.SetPosition(object2PosAtCollision);

    //    return millisecondsAfterCollision;
    //}

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
            if (agent.getX() - agent.radius() < 0) {
                agent.setPos(agent.radius() + 1, agent.position.y);
                agent.velocity.x *= -1;
            } else if (agent.getX() + agent.radius() > xBound) {
                agent.setPos(xBound - agent.radius() - 1, agent.position.y);
                agent.velocity.x *= -1;
            }

            if (agent.getY() - agent.radius() < 0) {
                agent.setPos(agent.position.x, agent.radius() + 1);
                agent.velocity.y *= -1;
            } else if (agent.getY() + agent.radius() > yBound) {
                agent.setPos(agent.position.x, yBound - agent.radius() - 1);
                agent.velocity.y *= -1;
            }
        }
    };

    AgentServiceFactory.moveAgent = function (name) {
        var agent = AgentServiceFactory.getAgent(name);
        if (agent) {
            //updateFac is frame update and conversion from meter/sec to centimeter/sec included.
            var modifiedVel = vMath.mulS(agent.velocity, updateFac());
            var newPos = vMath.addV(agent.position, modifiedVel);
            agent.setPos(newPos.x, newPos.y);
        }
    };

    AgentServiceFactory.clear = function () {
        agents = [];
        layers = [];
        selectedAgent = {};
    };

    AgentServiceFactory.drawAllLayers = function () {
        for (var i = 0; i < layers.length; i++) {
            layers[i].draw();
        }
    };

    return AgentServiceFactory;
});