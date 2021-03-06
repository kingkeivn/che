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
import {CheHttpBackend} from '../../api/test/che-http-backend';

interface ITestScope extends ng.IRootScopeService {
  model: {
    buttonTitle: string;
    popoverTitle: string;
    isOpen: boolean;
    content: string;
    onChange: (isOpen: boolean) => void;
  };
}

/**
 * Test of the CheTogglePopover directive.
 * @author Oleksii Kurinnyi
 */
describe('CheTogglePopover >', () => {

  let $rootScope: ITestScope,
      $timeout: ng.ITimeoutService,
      $compile: ng.ICompileService,
      compiledDirective: ng.IAugmentedJQuery;

  /**
   * Backend for handling http operations
   */
  let httpBackend: ng.IHttpBackendService;

  /**
   *  setup module
   */
  beforeEach(angular.mock.module('userDashboard'));

  beforeEach(inject((_$timeout_: ng.ITimeoutService,
                     _$compile_: ng.ICompileService,
                     _$rootScope_: ng.IRootScopeService,
                     cheHttpBackend: CheHttpBackend) => {
    $rootScope = _$rootScope_.$new() as ITestScope;
    $timeout = _$timeout_;
    $compile = _$compile_;

    httpBackend = cheHttpBackend.getHttpBackend();
    // avoid tracking requests from branding controller
    httpBackend.whenGET(/.*/).respond(200, '');
    httpBackend.when('OPTIONS', '/api/').respond({});

    $rootScope.model = {
      buttonTitle: 'My Button',

      popoverTitle: 'Popover Title',
      isOpen: false,
      content: 'Simple popover content',
      onChange: (isOpen: boolean) => {
        /* tslint:disable */
        const newIsOpen = isOpen;
        /* tslint:enable */
      }
    };

  }));

  afterEach(() => {
    $timeout.verifyNoPendingTasks();
  });

  function getCompiledElement() {
    const element = $compile(angular.element(
      `<div><che-toggle-popover title="{{model.popoverTitle}}"
                                placement="right-top"
                                is-open="model.isOpen"
                                on-change="model.onChange(isOpen)">
        <div che-multi-transclude-part="button">
          <che-button-primary che-button-title="{{model.buttonTitle}}"></che-button-primary>
        </div>
        <div che-multi-transclude-part="popover">
          <div>{{model.content}}</div>
        </div>
      </che-toggle-popover></div>`
    ))($rootScope);
    $rootScope.$digest();
    return element;
  }

  describe('initially switched off > ', () => {

    let toggleButtonWrapper;

    beforeEach(() => {
      compiledDirective = getCompiledElement();
      toggleButtonWrapper = compiledDirective.find('[che-multi-transclude-target="button"]');

      // timeout should be flashed
      $timeout.flush();
    });

    it('should have content hidden', () => {
      expect(compiledDirective.html()).not.toContain($rootScope.model.content);
    });

    it('should have button visible', () => {
      expect(toggleButtonWrapper.html()).toContain($rootScope.model.buttonTitle);
    });

    it('should have button disabled', () => {
      expect(toggleButtonWrapper.get(0)).toBeTruthy();
      expect(toggleButtonWrapper.hasClass('che-toggle-popover-button-disabled')).toBeTruthy();
    });

    describe('click on button >', () => {

      beforeEach(() => {
        toggleButtonWrapper.click();
        $rootScope.$digest();
      });

      it('should change isOpen value', () => {
        // timeout should be flashed to get callback called and content visible
        $timeout.flush();

        expect($rootScope.model.isOpen).toBeTruthy();
      });

      it('should make content visible', () => {
        // timeout should be flashed to get callback called and content visible
        $timeout.flush();

        expect(compiledDirective.html()).toContain($rootScope.model.content);
      });

      it('should enable button', () => {
        // timeout should be flashed to get callback called and content visible
        $timeout.flush();

        expect(toggleButtonWrapper.hasClass('che-toggle-popover-button-disabled')).toBeFalsy();
      });

      it('should call the callback', () => {
        spyOn($rootScope.model, 'onChange');

        // timeout should be flashed to get callback called and content visible
        $timeout.flush();

        expect($rootScope.model.onChange).toHaveBeenCalledWith(true);
      });

    });

    describe(`change state of toggle button from outside of directive >`, () => {

      beforeEach(() => {
        $rootScope.model.isOpen = true;
        $rootScope.$digest();
      });

      it('should make content visible', () => {
        // timeout should be flashed to get callback called and content visible
        $timeout.flush();

        expect(compiledDirective.html()).toContain($rootScope.model.content);
      });

      it('should enable button', () => {
        const toggleSingleButton = compiledDirective.find('button');

        // timeout should be flashed to get callback called and content visible
        $timeout.flush();

        expect(toggleSingleButton.hasClass('che-toggle-popover-button-disabled')).toBeFalsy();
      });

      it('should call the callback', () => {
        spyOn($rootScope.model, 'onChange');

        // timeout should be flashed to get callback called and content visible
        $timeout.flush();

        expect($rootScope.model.onChange).toHaveBeenCalledWith(true);
      });

    });

  });

  describe('initially switched on >', () => {
    let toggleButtonWrapper;

    beforeEach(() => {
      $rootScope.model.isOpen = true;

      compiledDirective = getCompiledElement();
      toggleButtonWrapper = compiledDirective.find('[che-multi-transclude-target="button"]');

      // timeout should be flashed
      $timeout.flush();
    });

    it('should have content visible', () => {
      expect(compiledDirective.html()).toContain($rootScope.model.content);
    });

    it('should have button visible', () => {
      expect(toggleButtonWrapper.html()).toContain($rootScope.model.buttonTitle);
    });

    it('should have button enabled', () => {
      expect(toggleButtonWrapper.get(0)).toBeTruthy();
      expect(toggleButtonWrapper.hasClass('che-toggle-popover-button-disabled')).toBeFalsy();
    });

    describe('click on button >', () => {

      beforeEach(() => {
        toggleButtonWrapper.click();
        $rootScope.$digest();
      });

      it('should change isOpen value', () => {
        // timeout should be flashed to get callback called and content visible
        $timeout.flush();
        $timeout.flush();

        expect($rootScope.model.isOpen).toBeFalsy();
      });

      it('should make content hidden', () => {
        // timeout should be flashed to get callback called and content hidden
        $timeout.flush();
        $timeout.flush();

        expect(compiledDirective.html()).not.toContain($rootScope.model.content);
      });

      it('should disable button', () => {
        // timeout should be flashed to get callback called and content hidden
        $timeout.flush();
        $timeout.flush();

        expect(toggleButtonWrapper.hasClass('che-toggle-popover-button-disabled')).toBeTruthy();
      });

      it('should call the callback', () => {
        spyOn($rootScope.model, 'onChange');

        // timeout should be flashed to get callback called and content hidden
        $timeout.flush();
        $timeout.flush();

        expect($rootScope.model.onChange).toHaveBeenCalledWith(false);
      });

    });

    describe(`change state of toggle button from outside of directive >`, () => {

      beforeEach(() => {
        $rootScope.model.isOpen = false;
        $rootScope.$digest();
      });

      it('should make content hidden', () => {
        // timeout should be flashed to get callback called and content hidden
        $timeout.flush();
        $timeout.flush();

        expect(compiledDirective.html()).not.toContain($rootScope.model.content);
      });

      it('should disable button', () => {
        // timeout should be flashed to get callback called and content hidden
        $timeout.flush();
        $timeout.flush();

        expect(toggleButtonWrapper.hasClass('che-toggle-popover-button-disabled')).toBeTruthy();
      });

      it('should call the callback', () => {
        spyOn($rootScope.model, 'onChange');

        // timeout should be flashed to get callback called and content hidden
        $timeout.flush();
        $timeout.flush();

        expect($rootScope.model.onChange).toHaveBeenCalledWith(false);
      });

    });

  });

});
