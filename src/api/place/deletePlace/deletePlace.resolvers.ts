import Place from "../../../entities/place";
import User from "../../../entities/user";
import {DeletePlaceMutationArgs, DeletePlaceResponse} from "../../../types/graph";
import {Resolvers} from "../../../types/resolver";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
    Mutation: {
        DeletePlace: privateResolver(
            async (_, args: DeletePlaceMutationArgs, {req})
                : Promise<DeletePlaceResponse> => {
                const user: User = req.user;
                try {
                    const place = await Place.findOne({id: args.placeId});
                    if (place) {
                        if (place.userId === user.id) {
                            await place.remove();
                            return {
                                ok: true,
                                error: null
                            };
                        } else {
                            return {
                                ok: false,
                                error: "not authorized"
                            };
                        }
                    } else {
                        return {
                            ok: false,
                            error: "place not found"
                        }
                    }
                } catch (error) {
                    return {
                        ok: false,
                        error: error.message
                    }
                }
            })
    }
};

export default resolvers;