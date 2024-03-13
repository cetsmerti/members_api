Archetypal solutions:
Partial DDD implementation, full implementation seems unnecessary to me. All work with the entity is done in the class, which gives the opportunity to work with it flexibly. Work with the base in the service, you could add a repository to work with the base, and the business logic in the service, but here there is nothing but work with the base, so it is unnecessary. The description of the schema is stored in the module, so as not to confuse with the data entity itself.
Realization of a large number of tests, but they cover the main business tasks.
I decided that we have all employees with their roles stored in one schema. There we can flexibly in the code to work with different methods that may come in tz. I chose the solution of roles through the state pattern .The solution is controversial but it has its advantages too. Salaries are stored in the database (you can add a trigger that will recalculate the salary, who needs).
Realizing queries through query builder or through direct queries, it would be easier to work with links ( but this is decided depending on the project, I build it, not everyone likes it).
Receipt of salaries can be realized dynamically when receiving (but when receiving a large number of entities, there would be performance slippage). But the total salary should be stored in the database separately, because if it was often shielded, it would be costly in resources.
Work out all the scenarios that could be, I have not envisaged all of them, because there is no sense in it.
Roles could be stored separately and all settings for them, plus it would be easier to add them (but then you have to rewrite everything).
The most controversial is the way of realization of scenarios. But I like this solution
