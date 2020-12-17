class: middle, primary
count: false

# Wayonara Front-End
## A style guide

---
class: center, middle, single-bigger

# Efficiency

---
class: center, middle, single-bigger

# Faster

---
class: center, middle, single

# Easier to work on

---
class: center, middle, single-bigger

# Fewer bugs

---
class: center, middle, single-bigger

# Investors

---
class: center, middle, single-bigger

# The rules

---
class: center, middle, single

# R1. Good beginnings

---

# R1. Good beginnings

```js
(function() {
    'use strict';

    angular.module('wayonara.foobar')
        .tasinanta('FooBarTasinanta', FooBarTasinanta);
}());

```

*   IIFE (Immediately Invoked Function Expression) - look at how it gets closed
*   Use `'use strict';`
*   Mind the empty line

## Why?

*   IIFEs and strict mode are safeguards against nasty bugs
*   Visually separate preparations from actual implementation

---
class: center, middle, single

# R2. Uan is megl' che ciù

---

# R2. Uan is megl' che ciù

In JavaScript and TypeScript:  

*   Use single quotation marks: `'`
*   Do not use double quotation marks: `"`

## Why?

*   One key instead of two keys - `SHIFT + '` - hundreds of times per day
*   Less visual clutter in files
*   Most JavaScript is written like this

---
class: center, middle, single

# R3. Meaningful spacing

---
# R3. Meaningful spacing

```js
angular.module('foo').controller('BarController', BarController);

BarController.$inject = ['AService', 'BService'];
/**
 * Optional comments, delete them when not really useful
 */
function BarController(AService, BService) {
    // code
}

```

In controllers / services / factories / tasinantas, mind this spacing.  
*Bonus:* use meaningful names, avoid naming a controller `Controller`.

## Why?

*   Visual separation
*   Easier to catch issues between the `$inject` array and the function using the injected dependencies

---
class: center, middle, single

# R4. Farewell, .text-lowercase[`$scope`]

---
# R4. Farewell, .text-lowercase[`$scope`]

```js
// Whenever declaring the use of a controller
templateUrl: 'foo/bar/mytemplate.html',
controller: 'RobotCrasherController',
controllerAs: 'vmRobotCrasher'

```

```js
// Inside the controller file
function RobotCrasher() {
    var vm = this; // vm = ViewModel - Angular is a MVVM framework

    // $scope.robotCount
    vm.robotCount

    // $scope.crashRobots = function ....
    vm.crashRobots = function() {
        // code
    }
}

```

```html
<p>Robots: {{ vmRobotCrasher.robotCount }}</p>

```

---
# R4. Farewell, .text-lowercase[`$scope`] - Why?

*   `$scope` is dangerous
*   `$scope` is unpredictable
*   `$scope` doesn't exist in Angular 2
*   `$scope` has nasty, unfixable, bugs
*   Increased readability

---
class: center, middle, single

# R5. Divide et Impera

---
# R5. Divide et Impera

Keep just 1 component / directive / service / controller / tasinanta per file

```js
// Nope. Nope. Nope.
// http://67.media.tumblr.com/45a6f06b8b2377ed61dc427cb98b2129/tumblr_njzhnm2xa41qet9hvo4_1280.png
// FooBarController.js

function FooContoller() { /* code */ }

function BarController() { /* code */ }

```

```js
// Yessah. Yessah. Yessah.
// https://www.comunicaffe.it/wp-content/uploads/2016/09/LAVAZZA_Frame_006-640x360.jpg

// FooController.js
function FooContoller()  { /* code */ }

// BarController.js
function BarController()  { /* code */ }

```

---
# R5. Divide et Impera - Why?

*   Shorter, clearer files
*   Contributes to paving the way for unit tests
*   Statistics show it's always better to have three items in a list

---
class: center, middle, single

# R6. Structure in names

---
# R6. Structure in names

Like this: `lowercase-dashed-name.tasinanta.extension`

```sh
# old
FooBarController.js

# new - contains FooBarController
foo-bar.controller.js
```

```sh
# old
view.html

# new - for templates, not for ng-includes or the like
foo-bar.template.html
```

---
# R6. Structure in names - Why?

*   Similar to Angular 2 naming convention:  
`foo-bar.component.ts` and `foo-bar.component.html`
*   Nicely sorted
*   You can quickly scan for all the parts of a tasinanta

---
class: center, middle, single

# R7. A service is a service

---
# R7. A service is a service

```js
angular.module('wayonara.baz')
    .service('FooBarService', FooBarService);

function FooBarService() {

    // Get a Foo by its Id
    this.getFooById = getFooById;

    // Turns all the Foos into Bars
    this.turnFoosIntoBars = turnFoosIntoBars;

    function getFooById(fooId) {
        // code
    }

    function turnFoosIntoBars(fooCollection) {
        // code
    }
}

```

Avoid `factory`, always use `service`.

---
# .text-smaller[R7. A service is a service - Why?]

<figure>
    <img src="https://i.ytimg.com/vi/XQzehz5i4Rg/maxresdefault.jpg" />
    <figcaption>
        <p>Ask John Papa!</p>
    </figcaption>
</figure>

*   [Accessible Members Up Top](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#style-y052)
*   [Function Declarations to Hide Implementation Details](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#style-y053)
*   Also, we reserve `factory` for `ngResource` (coming in 2017)

---
class: center, middle, single-smaller

# R8. One-time or another

---
# R8. One-time or another

```html
<p>{{ ::vmFooBar.translations.hello }}</p>

```

Prefix translations with `::` to activate one-time binding.

## Why?

> The main purpose of one-time binding expression is to provide a way to create a binding that gets deregistered and frees up resources once the binding is stabilized.

> Reducing the number of expressions being watched makes the digest loop faster and allows more information to be displayed at the same time.

---
class: center, middle, single-smaller

# R9. The zen of the snake

---
# R9. The zen of the snake

```js
// DO
if (myVar === true) {}

// DO
if (myVar !== undefined) {}

// DON'T
if (myVar) {}
```

```js
// DO
controller: 'FooBarController',
controllerAs: 'vmFooBar'

// DON'T
controllerAs: 'vmFB'

// DON'T
controllerAs: 'vmFBC'
```

---
# R9. The zen of the snake

```js
// DO
function getFooBitMask() {}

// DON'T
function getFooBM() {}
```

```js
// DO
let subscription;

// DON'T
let sub;
```

```js
// DO
let fooBarPlaceOptions;

// DON'T
let fooBarPlaceOpts;
```

---
# .text-smaller[R9. The zen of the snake - Why?]

> Beautiful is better than ugly.
>
> Explicit is better than implicit.
>
> Simple is better than complex.
>
> Complex is better than complicated.
>
> Flat is better than nested.
>
> Sparse is better than dense.
>
> Readability counts.
>
> [...]

<cite>[The Zen of Pyhton](https://www.python.org/dev/peps/pep-0020/#id3)</cite>

---
class: center, middle, single-smaller

# R10. Object literal !== JSON

---
# R10. Object literal !== JSON

```js
// DO
{
    foo: 'bar',
    baz: 'bat'
}

// DON'T
{
    'foo': 'bar',
    'baz': 'bat'
}

```

Don't write object literals like they were JSON snippets.

## Why?

- They are just two different things
- Readability!

---
class: center, middle, primary, single-bigger
count: false

# Thanks!
