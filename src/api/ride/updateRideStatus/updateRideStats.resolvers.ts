import User from "../../../entities/user";
import {UpdateRideStatusMutationArgs, UpdateRideStatusResponse} from "../../../types/graph";
import {Resolvers} from "../../../types/resolver";
import privateResolver from "../../../utils/privateResolver";
import Ride from "../../../entities/ride";

const resolvers: Resolvers = {
    Mutation: {
        UpdateRideStatus: privateResolver(
            async (_, args: UpdateRideStatusMutationArgs, {req})
                : Promise<UpdateRideStatusResponse> => {
                const user: User = req.user;
                if (user.isDriving) {
                    try {
                        let ride: Ride | undefined;
                        if (args.status === "ACCEPTED") {
                            ride = await Ride.findOne({
                                id: args.rideId,
                                status: "REQUESTING"
                            });
                            if (ride) {
                                ride.driver = user;
                                user.isTaken = true;
                                await user.save();
                            }
                        } else {
                            ride = await Ride.findOne({
                                id: args.rideId,
                                driver: user
                            })
                        }

                        if (ride) {
                            ride.status = args.status;
                            await ride.save();
                            return {
                                ok: true,
                                error: null
                            }
                        } else {
                            return {
                                ok: false,
                                error: "Can't update ride"
                            }
                        }

                    } catch (error) {
                        return {
                            ok: false,
                            error: error.message
                        }
                    }
                } else {
                    return {
                        ok: false,
                        error: "User is not driving"
                    }
                }
            }
        )
    }
};

export default resolvers;