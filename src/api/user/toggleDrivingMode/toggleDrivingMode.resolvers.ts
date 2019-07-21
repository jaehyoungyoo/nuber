import User from "../../../entities/user";
import {ToggleDrivingModeResponse} from "../../../types/graph";
import {Resolvers} from "../../../types/resolver";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
    Mutation: {
        ToggleDrivingMode: privateResolver(
            async (_, __, {req}): Promise<ToggleDrivingModeResponse> => {
                const user: User = req.user;
                user.isDriving = !user.isDriving;
                await user.save();
                return {
                    ok: true,
                    error: null
                }
            })
    }
};

export default resolvers;