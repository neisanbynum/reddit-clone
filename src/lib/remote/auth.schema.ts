import { EmailSchema, NameSchema, UsernameSchema } from '$remote/shared.schema'
import z from 'zod/v4'

export const LoginFormSchema = z.object({
    identifier: z.coerce.string('Invalid Email Address/Username'),
    password: z.coerce.string('Password Must Be Alpha-Numeric')
});

export const RegisterFormSchema = z
    .object({
        last: NameSchema,
        first: NameSchema,
        middle: NameSchema.nullish(),
        prefermiddle: z.boolean().default(false),
        username: UsernameSchema,
        email: EmailSchema,
        password: z
            .string('Password Must Be Alpha-Numeric')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,24}$/),
        confirmpassword: z.string('Password Must Be Alpha-Numeric')
    })
    .refine(({ password, confirmpassword }) => password === confirmpassword, {
        path: ['confirmpassword'],
        abort: false,
        message: 'Does Not Match Password'
    });

    export const SessionCookieSchema = z.object({
        username: UsernameSchema,
        client: z.coerce.string('Invalid Session Cookie Client Address'),
        expires: z.coerce.date("Invalid Session Expiration Date")
    });
    export type SessionCookieSchema = typeof SessionCookieSchema;
    
    export const PermissionSchema = z.literal(['legal', 'posts']);
    export type PermissionSchema = typeof PermissionSchema;
    
    export const AuthoritySchema = z.literal(['create', 'edit', 'delete']);
    export type AuthoritySchema = typeof AuthoritySchema;
    
    export const SiteManagerFormSchema = z.object({
        username: UsernameSchema,
        legal: AuthoritySchema.nullish(),
        posts: AuthoritySchema.nullish()
    })
    
    export const RemoveSiteManagerFormSchema = z.object({
        username: UsernameSchema
    })
