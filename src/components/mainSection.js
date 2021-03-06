import React, { Component } from 'react'
import axios from 'axios'
import PortfolioSection from './portfolioSection'
import ArticleFeed from './articleFeed.js'
import QueryRecommendationButton from './queryRecommendationButton'

export default class mainSection extends Component {
    constructor() {
        super();
        this.state = {
          articles: [],
          portfolio_assets: [],
          //  default seed company is twitter
          seed_company: 'snapchat',
          user: 2
        }
    }

    queryRecommendations(company) {
        const recom_url = `/recommendations/recommendations_${company.toLowerCase()}.json`;
         console.log(recom_url);
         axios.get(recom_url) // JSON File Path
           .then( response => {
             this.setState({
             articles: response.data
           });
             console.log(response)
         })
         .catch(function (error) {
           console.log(error);
         });
    }

    componentWillMount() {
        this.queryRecommendations(this.state.seed_company);

      axios.get(`/user_data/user_portfolio_${this.state.user}.txt`) // JSON File Path
       .then( response => {
         this.setState({
         portfolio_assets: response.data
       });
         console.log(response)
     })
     .catch(function (error) {
       console.log(error);
     });
    }

    handleCompanyChange(old_seed_company, changed_company) {
        console.log('yoooooooo', changed_company)
        if (changed_company.toLowerCase() === old_seed_company) {
            return
        }
        this.setState({
            seed_company: changed_company.toLowerCase()
        });
        console.log('brooo', this.state.seed_company)
        this.queryRecommendations(changed_company);
        this.forceUpdate();
    };

    render() {
        console.log(this.state.seed_company);
        const articles = this.state.articles;
        const portfolio_assets = this.state.portfolio_assets;
        let ArticleSectionPlaceHolder = '';
        let PortfolioSectionPlaceHolder = '';

        if(articles.length > 0) {
            ArticleSectionPlaceHolder = (
                <ArticleFeed articles={articles}
                />
                )
        }

        if(portfolio_assets.length > 0) {
            PortfolioSectionPlaceHolder = (
                <PortfolioSection
                    portfolio={portfolio_assets}
                    handleChange={(c) => this.handleCompanyChange(this.state.seed_company, c)}
                />)
        }

        return (
                <div>
                    {PortfolioSectionPlaceHolder}
                    {ArticleSectionPlaceHolder}
                    <QueryRecommendationButton/>
                </div>
        )
    }

}
