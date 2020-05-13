# Svelte Adress Autocomplete

[![npm version](https://badge.fury.io/js/svelte-address-autocomplete.svg)](https://www.npmjs.com/package/svelte-address-autocomplete) &bull; [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/JonasJs/svelte-address-autocomplete/blob/master/LICENSE) &bull;[![Dependencies](https://david-dm.org/jonasjs/svelte-adress-autocomplete.svg)](https://david-dm.org/jonasjs/svelte-adress-autocomplete) &bull;[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/github/jonasjs/svelte-adress-autocomplete.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/jonasjs/svelte-adress-autocomplete/context:javascript)

Adress Autocomplete Component to Svelte

## Installation

```
npm i svelte-address-autocomplete
// OR
yarn add svelte-address-autocomplete
```

<em>Note: to use this library in sapper, install as devDependency. See the [link](https://github.com/sveltejs/sapper-template#using-external-components).</em>

## Demo [Link](https://svelte-address-autocomplete.now.sh/)

Local demo:

```
git clone https://github.com/JonasJs/svelte-address-autocomplete.git
cd svelte-address-autocomplete
yarn install && yarn start
```

## Examples

An example of how to use the library:

```js
<script>
  import AdressAutocomplete from "svelte-address-autocomplete";
  
  
  let zipCodeValue = "";
  let streetValue = "";

  let autocompleteObj = {};

  function handleCallback(({detail}) {
    if(detail.data){
      autocompleteObj = detail.data
    } else {
      alert("Zip not found!")
    }
  
  }
  
</script>

<AdressAutocomplete on:callback={handleCallback} className="newName">
  <div class="form-group">
    <label>Rua: </label>
    <input type="text" name="street" bind:value={autocompleteObj.logradouro} />
  </div>
</AdressAutocomplete>

```

## Properties

Component props:

| Prop         | Type   | Description                                  |
| ------------ | ------ | -------------------------------------------- |
| className    | string | Create a class to modify the component       |

## Events

| Prop     | Type | Description                             |
| -------  | ---- | --------------------------------------- |
| callback | func | callback with address information       |

## NPM Statistics

Download stats for this NPM package

[![NPM](https://nodei.co/npm/svelte-adress-autocomplete.png)](https://nodei.co/npm/svelte-adress-autocomplete/)

## License

Svelte Adress Autocomplete is open source software [licensed as MIT](https://github.com/JonasJs/svelte-address-autocomplete/blob/master/LICENSEE).
