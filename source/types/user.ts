/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Collection of user related types
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

interface UserBase<T extends string> {
  object: 'user';
  id: string;
  type: T;
  name: string;
  avatar_url?: string;
}

export interface PersonUser extends UserBase<'person'> {
  person?: {
    email: string;
  };
}

export type BotUser = UserBase<'bot'>;

export type User = PersonUser | BotUser;
