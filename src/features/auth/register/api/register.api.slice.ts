import {RegisterReqDto} from "../../../../api/request-dto/auth.req.ts";
import {authService} from "../../../../api/configs";
import {createApi} from "@reduxjs/toolkit/query/react";

export const registerApiSlice = createApi({
    baseQuery: async () => ({ data: {} }),
    reducerPath: 'registerApi',
    endpoints: (builder) => ({
        register: builder.mutation<
            unknown,
            RegisterReqDto
        >({
            queryFn: async (payload) => {
                try {
                    const res = await authService.register(payload);
                    return { data: res };
                } catch {
                    return {
                        error: {
                            status: 'Register Failed',
                            message: 'Oops, something went wrong',
                        },
                    };
                }
            },
        }),

    }),
});

export const {
    useRegisterMutation
}= registerApiSlice