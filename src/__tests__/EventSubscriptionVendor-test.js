/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+uiecommd
 */

'use strict';

jest.disableAutomock();

const EventSubscriptionVendor = require('EventSubscriptionVendor');
const EventSubscription = require('EventSubscription');

describe('EventSubscriptionVendor', function() {
  it('adds subscriptions', function() {
    const subscriber = new EventSubscriptionVendor();
    expect(subscriber.getSubscriptionsForType('type1')).toBe(undefined);
    subscriber.addSubscription('type1', new EventSubscription(subscriber));
    expect(subscriber.getSubscriptionsForType('type1').length).toBe(1);
  });

  it('adds subscriptions keyed on type', function() {
    const subscriber = new EventSubscriptionVendor();
    subscriber.addSubscription('type1', new EventSubscription(subscriber));
    subscriber.addSubscription('type2', new EventSubscription(subscriber));
    expect(subscriber.getSubscriptionsForType('type1').length).toBe(1);
  });

  it('removes a subscription', function() {
    const subscriber = new EventSubscriptionVendor();
    const subscription1 = new EventSubscription(subscriber);
    subscription1.is1 = true;
    subscriber.addSubscription('type1', subscription1);
    const subscription2 = new EventSubscription(subscriber);
    subscription2.is1 = false;
    subscriber.addSubscription('type1', subscription2);
    expect(subscriber.getSubscriptionsForType('type1').length).toBe(2);
    subscriber.removeSubscription(subscription1);
    const subscriptions = subscriber.getSubscriptionsForType('type1');
    let allempty = true;
    for (const key in subscriptions) {
      if (subscriptions[key]) {
        allempty = false;
        expect(subscriptions[key].is1).toBeFalsy();
      }
    }
    expect(allempty).toBeFalsy();
  });

  it('removes all subscriptions of a certain type', function() {
    const subscriber = new EventSubscriptionVendor();
    subscriber.addSubscription('type1', new EventSubscription(subscriber));
    subscriber.addSubscription('type1', new EventSubscription(subscriber));
    expect(subscriber.getSubscriptionsForType('type1').length).toBe(2);
    subscriber.removeAllSubscriptions('type1');
    expect(subscriber.getSubscriptionsForType('type1'))
        .toBe(undefined);
  });
});
