# Svelte Adress Autocomplete

[![npm version](https://badge.fury.io/js/svelte-address-autocomplete.svg)](https://www.npmjs.com/package/svelte-address-autocomplete)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/JonasJs/svelte-address-autocomplete/blob/master/LICENSE)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/JonasJs/svelte-address-autocomplete.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/JonasJs/svelte-address-autocomplete/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/JonasJs/svelte-address-autocomplete.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/JonasJs/svelte-address-autocomplete/context:javascript)

Adress Autocomplete Component to Svelte

## Installation

```
npm i svelte-address-autocomplete
// OR
yarn add svelte-address-autocomplete  
```

<em>Note: to use this library in sapper, install as devDependency. See the [link](https://github.com/sveltejs/sapper-template#using-external-components).</em>

## Demo [Link](https://svelte-address-autocomplete.now.sh/)

[![Checkout step 1](https://user-images.githubusercontent.com/11879767/81888697-4685a800-9578-11ea-8dee-5514da205eb8.png)](https://svelte-address-autocomplete.now.sh/)

Local demo:

```
git clone https://github.com/JonasJs/svelte-address-autocomplete.git
cd svelte-address-autocomplete
yarn install && yarn start
```

## Examples

An example of how to use the library:

**[Complex example Repl](https://svelte.dev/repl/7bcbc763ca264c3cb9eb2a3ac790b705?version=3.22.2)**

**[Simple Example Repl](https://svelte.dev/repl/14fe0372c4c14fb6aebf4cb7092b8063?version=3.22.2)**

```js
<script>
  import AdressAutocomplete from "svelte-address-autocomplete"
</script>
```

```html
<div class="form">
  <h1>Svelte Adress Autocomplete</h1>
  <AdressAutocomplete className="newName" let:data let:onBlur>
    <label>Postal Code</label>
    <input type="text" on:blur="{onBlur}" />
    <h4>{data ? data.street : 'No address'}</h4>
  </AdressAutocomplete>
</div>
```

```css
<style>
  label {
    margin-bottom: 8px;
  }
</style>
```

## Properties

Component props:

| Prop      | Type   | Description                            |
| --------- | ------ | -------------------------------------- |
| className | string | Create a class to modify the component |

## Events

| Prop     | Type | Description                       |
| -------- | ---- | --------------------------------- |
| callback | func | callback with address information |

### Address Informations

```js
{
  neighborhood,
  zipCode,
  complement,
  city,
  street,
  fu,
}
```

## Slot Properties

| Prop  | Type   | Description         |
| ----- | ------ | ------------------- |
| data  | object | Address Information |
| error | any    | Request exception   |

## NPM Statistics

Download stats for this NPM package

[![NPM](https://nodei.co/npm/svelte-address-autocomplete.png)](https://nodei.co/npm/svelte-address-autocomplete/)

## License

Svelte Adress Autocomplete is open source software [licensed as MIT](https://github.com/JonasJs/svelte-address-autocomplete/blob/master/LICENSEE).
