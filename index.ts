import React, {PureComponent, useEffect, useMemo, useState} from 'react';
import { httpPatch } from 'lib/http';
// import './dropdown.scss';

/* 
Prompt:
  We have defined a basic dropdown via the Dropdown and DropdownItem components below, with example usage
  in the ExampleNav component. The Dropdown and DropdownItem components have some problems, and also 
  have room for improvements (doesn't everything?) A couple items TODO here (make sure to explain with comments!)
  
  0. How are you today? 😊
  - I'm fine thanks for asking, and I will do my best.

  1. Please fix any obvious issues you see with the dropdown.
  - Fixed some issues
  - I like more to work with TS
  - I maked navigation component more generic, navigation components tends to change frequently durign development
  and this is the most comom recieve props to feed a component
  - for this example I let hardcoded properties for ExampleNav
  - If we need to style one good aproach is using styled modules with sass, I realy like this approach

  2. Please then make improvements to the dropdown and make it a bit more React-y. Assume this was cobbled
     together or brought in hastily from StackOverflow.
  - I made some changes to code be more readable

  3. Given that this dropdown might form the basis of an Account picker, a searchable list of Product Tours, one
     step of a flow to configure alerting, etc... Please explore with text or code the way you would approach this.
  - We can explore this further by adding a variants concept in the dropdown menu, I did it wrong in ExampleNav but it can 
  be explored further with the right time

  4. If we wanted to sync this dropdown selection to the server with
    httpPatch('user', { [`dropdown-state-${key}`]: {true,false} }) where would this be included OR how best to
    handle this (properties needing to be synced to the backend)?
  - this questions is very abrangent:
  Have a lot of procediments that should fill this:
  -- You have a dropdown list and to set the first selected component this can be brought earlier with adding index or 
  selected prop in properties for ExampleNav
  -- Also can use a tech like next.js to bring it back and render the item selected properly, avoiding unnecessary screen changes

  5. Anything else to add here?
  - I updated the structure of components using modern approaches
  - I created variants to deal with different kind of navigation item, for now is true or false because have only two components,
  but can be used names to be more code friendly or if need to expands to more variants can be explored others concepts.
  - I replaced PureComponents to useMemo, it is not really necessary but is an good approach

  6. Unrelated to this, what is one new feature you would add to React?
  - This is kind of my opinion but I believe in a better organization between layout and logic I really like to see more like angular do, 
  dividing logic and layout into different files.
  -More easily integration with redux, today I already have experience, but it's kinda a complicated to integrate when 
  you are starting with redux.
  - still talking about state, i really appreciate a better solution to resolve data changes in a complex object
  like {
    obj: {},
    items: [
      obj2 : {
        obj3 : {

        }
      }
    ]
  }

  this example above is such a complex to manage in react and needs to be restructured, this is kinda bad when you need to
  send this data back to the backend again, if you decided to use the destructuring process you need to put it in a structured object
  again, and i believe this is very dangerous

  PS: No need to worry about CSS, actually making it "run" etc...
 */


declare type PropsDropDown = {
  items: NavigationItem[],
  label: string
}

  export const Dropdown = function({ items, label } : PropsDropDown) {
    const [ isOpen, setOpen ] = useState(false);

    const toggle = () => {
      setOpen(!isOpen);
    }

    const dropItemsRender = () => {
      return items.map((item, idc) => {
        return <DropdownItem 
                  href={ item.href! } 
                  key={ `drop-down-item-${idc}` }
                >
                  { item.label }
                </DropdownItem>
      })
    }

    const dropitems = useMemo(dropItemsRender, [items]);

    return <div className="dropdown">
            <button 
              type="button" 
              className="dropdown-button" 
              id="dropdownButton" 
              aria-haspopup="true" 
              aria-expended={isOpen} 
              onClick={toggle}>
                {label}
            </button>
            <ul 
              className={`${isOpen ? 'dropdown-open' : ''} dropdown-menu`} 
              aria-labelledby="dropdownButton" 
              role="menu">
                { isOpen &&  dropitems }
            </ul>
         </div>
  }
  
  declare type DropdownItemProps = {
    children : String,
    href: string
  }

  const DropdownItem = function({ children, ...props } : DropdownItemProps) {
      return <li>{ children }</li>
  }
  

  declare type NavigationItem = {
    href ?: string,
    items ?: NavigationItem[],
    onClick?: () => void,
    label: string
  }

  declare type NavProps = {
    tree ?: NavigationItem[]
  }

  const hardcodedProps :NavigationItem[] = [
    {
      label: 'Page 1',
      href : '/page1'
    },
    {
      label: 'More Items',
      items: [
        {
          label: 'Page 2',
          href : '/page2'
        },
        {
          label: 'Page 3',
          href : '/page3'
        },
        {
          label: 'Page 4',
          href : '/page4'
        },
      ]
    },
    {
      label: 'Even More Items',
      items: [
        {
          label: 'Page 5',
          href : '/page5'
        },
        {
          label: 'Page 9',
          href : '/page9'
        }
      ]
    },
    
  ];

declare type SingleItemProps = {
  label: string,
  href ?: string
}

  const SingleItemNav = ({ label, href }: SingleItemProps) => {
    return <a href={ href }>
              { label }
            </a>
  }

  export const ExampleNav = function({ tree = hardcodedProps } : NavProps) {
    const variants : any= {
      true: Dropdown,
      false: SingleItemNav
    };
    
    const navItemsProcess : () => JSX.Element[] = () => {
      return tree.map((item, idc) => {
        let sentence : any = Boolean(item.items?.length);
        const Variant = variants[sentence];
        return <Variant { ...item } key={ `nav-item-${idc}` }/>
      })
    }

    const navItems: JSX.Element[] = useMemo(navItemsProcess, [tree])

    return <nav>
          { navItems }
    </nav>
}
  
