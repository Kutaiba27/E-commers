
export class ApiFeatures { 

   constructor(mongooseQuery, queryString){
      this.mongooseQuery = mongooseQuery;
      this.queryString = queryString;
   }

   filter(){
      const queryObject = { ...this.queryString }
      const excludesFields = ['page', 'limit', 'sort', 'fields']
      excludesFields.forEach((item)=> delete queryObject[item])
      let query = JSON.stringify(queryObject)
      query = query.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
      this.mongooseQuery = this.mongooseQuery.find(JSON.parse(query))
      return this
   }

   search(modelName){
      if(this.queryString.keyword){
         let query = {};
         if(modelName == "Product") {
            query.$or = [
               {title: {$regex: this.queryString.keyword, $options: 'i'}},
               {description: {$regex: this.queryString.keyword, $options: 'i'}}
            ];
         }else{
            query = {title: {$regex: this.queryString.keyword, $options: 'i'}}
         }
         console.log("this is",query);
         this.mongooseQuery.find({title: {$regex: "Gold", $options: 'i'}})
      }
      return this;
   }
   
   sort(){
      if(this.queryString.sort){
         const sortBy = this.queryString.sort.replace(/\b,\b/g," ")
         this.mongooseQuery.sort(sortBy)
      }else{
         this.mongooseQuery.sort("createdAt")
      }
      return this;
   }

   limitFeilds(){
      if(this.queryString.fields){
         const fieldsSel = this.queryString.fields.replace(/\b,\b/g," ")
         this.mongooseQuery.select(fieldsSel)
      }else{
         this.mongooseQuery.select('-__v')
      }
      return this;
   }

   pagenate(countDocuments) {

      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 10;
      const skip = (page - 1) * limit;
      const pageObject = {}
      pageObject.currntPage = page;
      pageObject.limit = limit;
      pageObject.numberOfPages = Math.ceil(countDocuments / limit)
      if(page * limit < countDocuments){
         pageObject.nextPage = pageObject.currntPage + 1;
      }
      if (0 < skip){
         pageObject.privuse = pageObject.currntPage - 1; 
      }
      this.pagenation = pageObject;
      this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
      return this;
   }
}