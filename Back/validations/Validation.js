import { body } from 'express-validator';

export const loginValidation = [
    body('email').isEmail(), // checking if the input in the email field is an Email
    body('password').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email').isEmail(), 
    body('password').isLength({ min: 5 }),
    body('fullName').isLength({ min: 3}),
    body('avatarUrl').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Header please').isLength({ min: 1 }).isString(),
    body('text', 'Description please').isLength({ min: 3 }).isString(),
    body('tags','An array of tags pls').optional().isArray(),
    body('imageUrl', 'Go fuck yourself').optional().isString(),
];

export const commentCreateValidation = [
    body('text', 'Text please').isLength({ min: 1 }).isString(),
];
