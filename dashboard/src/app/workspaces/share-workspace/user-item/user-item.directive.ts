/*
 * Copyright (c) 2015-2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
'use strict';

/**
 * Defines a directive for user item in permissions list.
 *
 * @author Ann Shumilova
 */
export class UserItem implements ng.IDirective {
  restrict = 'E';

  templateUrl = 'app/workspaces/share-workspace/user-item/user-item.html';
  replace = false;

  controller = 'UserItemController';
  controllerAs = 'userItemController';

  bindToController = true;

  scope: {
    [propName: string]: string;
  };

  /**
   * Default constructor.
   */
  constructor() {
    // scope values
    this.scope = {
      user: '=cheUser',
      callback: '=callback'
    };
  }
}
