import axios from 'axios';


interface Country {
  name: string;
  code: string;
  capital: string;
  region: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  language: {
    code: string;
    name: string;
  };
  flag: string;
  dialling_code: number;
  isoCode: number;
}

interface SearchCriteria {
  name: string;
  capital: string;
  currency: string;
  language: string;
}

class CountryManager {
  private countries: Country[] = [];
  private currentIndex: number = 1;

  private pageSize: number = 20;

  constructor() {
    this.getData((this.currentIndex));
    this.setupSearchButton();
    this.setupButtons();
  }

  private getData(page: number) {
    axios.get('http://localhost:3004/countries?_page=' + page + '&_limit=' + this.pageSize).then((response) => {
      this.countries = response.data;
      const limitedCountries = this.countries;
      this.populateTable(limitedCountries);
    });
  }


  // private getNextCountries(): Country[] {
  //   const startIdx = this.currentIndex;
  //   const endIdx = this.currentIndex + this.pageSize;
  //   this.currentIndex = endIdx; // Move currentIndex to the end of the current page
  //   return this.countries.slice(startIdx, endIdx);
  // }
  //
  // private getCurrentPageCountries(): Country[] {
  //   const startIdx = this.currentIndex;
  //   const endIdx = this.currentIndex + this.pageSize;
  //   return this.countries.slice(startIdx, endIdx);
  // }

  private populateTable(countries: Country[]) {
    const tableBody = document.querySelector('.countryTableBody') as HTMLTableSectionElement;
    this.clearTable(true);

    if (countries && countries.length > 0) {
      countries.forEach((country) => {
        const row = tableBody.insertRow();
        
        const nameCell = row.insertCell(0);
        const codeCell = row.insertCell(1);
        const capitalCell = row.insertCell(2);
        const regionCell = row.insertCell(3);
        const currencyCell = row.insertCell(4);
        const languageCell = row.insertCell(5);
        const flagCell = row.insertCell(6);
        const dialling_codeCell = row.insertCell(7);
        const isoCodeCell = row.insertCell(8);
  
        nameCell.textContent = country.name;
        codeCell.textContent = country.code;
        capitalCell.textContent = country.capital;
        regionCell.textContent = country.region;
  
        currencyCell.textContent = `${country.currency.code} (${country.currency.symbol}) - ${country.currency.name}`;
        languageCell.textContent = `${country.language.code} ${country.language.name}`;
  
        flagCell.textContent = country.flag;
        dialling_codeCell.textContent = country.dialling_code.toString();
        isoCodeCell.textContent = country.isoCode.toString();
      });
    } else {
      this.displayNoResultsMessage();
    }
  }

  private displayNoResultsMessage() {
    console.log('No countries match the search criteria.');
  }

  private clearTable(clear: boolean) {
    if (clear) {
      const tableBody = document.querySelector('.countryTableBody') as HTMLTableSectionElement;
      tableBody.innerHTML = '';
    }
  }

  private setupSearchButton() {
    const searchButton = document.querySelector('.search__button') as HTMLButtonElement;
    searchButton.addEventListener('click', () => this.searchData());
  }

  public setupButtons() {
    this.setupNextButton();
    this.setupPrevButton();
  }

  public loadMore() {
    this.currentIndex++;
    this.getData(this.currentIndex);
  }

  public loadPrev() {
    this.currentIndex -= this.pageSize;
    if (this.currentIndex < 1) {
      this.currentIndex = 1;
    }
    this.getData(this.currentIndex);
  }

  private setupPrevButton() {
    const prevButton = document.querySelector('.button-prev__button') as HTMLButtonElement;
    prevButton.addEventListener('click', () => this.loadPrev());
  }

  private setupNextButton() {
    const nextButton = document.querySelector('.button-more__button') as HTMLButtonElement;
    nextButton.addEventListener('click', () => this.loadMore());
  }

  public searchData() {
    const name = (document.querySelector('.name') as HTMLInputElement).value;
    const capital = (document.querySelector('.capital') as HTMLInputElement).value;
    const currency = (document.querySelector('.currency') as HTMLInputElement).value;
    const language = (document.querySelector('.language') as HTMLInputElement).value;

    this.fetchData({ name, capital, currency, language });
  }

  private fetchData(searchCriteria: SearchCriteria, sortBy: keyof Country = 'name') {
    let filteredCountries = this.countries;

    if (Object.values(searchCriteria).every((value) => value === '')) {
      filteredCountries = this.countries;
    } else {
      filteredCountries = this.countries.filter((country) => {
        return (
          country.name.toLowerCase().startsWith(searchCriteria.name.toLowerCase()) &&
          country.capital.toLowerCase().startsWith(searchCriteria.capital.toLowerCase()) &&
          typeof country.currency.name === 'string' &&
          country.currency.name.toLowerCase().startsWith(searchCriteria.currency.toLowerCase()) &&
          typeof country.language.name === 'string' &&
          country.language.name.toLowerCase().startsWith(searchCriteria.language.toLowerCase())
        );
      });
    }
    filteredCountries.sort((a, b) => {
      const aValue = String(a[sortBy]).toLowerCase();
      const bValue = String(b[sortBy]).toLowerCase();

      if (aValue < bValue) {
        return -1;
      } else if (aValue > bValue) {
        return 1;
      } else {
        return 0;
      }
    });
    const limitedCountries = filteredCountries.slice(0, 20);

    this.populateTable(limitedCountries);
  }

  public searchButton() {
    document.querySelector('.search__button').addEventListener('click', this.searchButton);

    this.searchData();
    _countryManager.searchData();
  }
}

const _countryManager = new CountryManager();

  