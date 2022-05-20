/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Collection of user related examples
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import type { NotionAPIUser } from '#types';

export const personUser: NotionAPIUser = buildDummyUser({
  userID: 'person_user',
});

export const personUserWithoutEmail: NotionAPIUser = buildDummyUser({
  userID: 'person_user',
  email: null,
});

export const botByUser: NotionAPIUser = buildDummyUser({
  userID: 'user_bot',
  type: 'user_bot',
  name: 'Bot',
});

export const botWithoutUser: NotionAPIUser = buildDummyUser({
  userID: 'workspace_bot',
  type: 'workspace_bot',
  name: 'Bot',
});

/**
 * generate a dummy Notion API's user object with the given properties
 * @param arg collection of properties to be altered
 * @param arg.userID the ID of the user to be retrieved
 * @param arg.name name of the user
 * @param arg.type type of user to be generated
 * @returns an object mimicking the body of the return of Notion's user's retrieval API
 */
export function buildDummyUser(arg: {
  userID: string;
  name?: string;
  email?: string | null;
  type?: 'user_bot' | 'workspace_bot' | 'person';
}): NotionAPIUser {
  const { userID, name = 'Name', email = 'email', type = 'person' } = arg;

  const basis = {
    object: 'user' as const,
    id: userID,
    name,
    avatar_url: 'url',
  };

  switch (type) {
    case 'person':
      return {
        ...basis,
        type: 'person',
        person: {
          ...(email ? { email } : {}),
        },
      };
    case 'user_bot':
      return {
        ...basis,
        type: 'bot',
        bot: {
          owner: { type: 'user', user: personUser },
        },
      };
    case 'workspace_bot':
      return {
        ...basis,
        type: 'bot',
        bot: {
          owner: { type: 'workspace', workspace: true },
        },
      };
  }
}
