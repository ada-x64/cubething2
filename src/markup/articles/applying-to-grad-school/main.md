So I'm applying to graduate school. Where to start?

I began by scraping data from the
[philosophical gourmet](https://www.philosophicalgourmet.com/summary-of-specialty-rankings/)
using the table available under the header
["summary of specialty rankings."](https://www.philosophicalgourmet.com/summary-of-specialty-rankings/)
I did this part manually by using query selectors to construct a JSON table.
Once that was done, I created a [JupyterLab notebook](https://jupyter.org) and
collated the data using [Polars](https://pola.rs) and
[Perspective](https://github.com/finos/perspective) (I had actually done this
step while working at Prospective, the company behind this visualization tool,
so it is no surprise I used what I was familiar with). I ranked the data by
mapping my areas of interest to a scale, with 1 as the highest ranking.
Multiplying gave me a simple ranking. I replaced all null values with 1000 so I
could order the columns in descending order. You can see the final notebook
[on my github](https://github.com/ada-x64/phil-gourmet).

Once I had manually gone over the results and ensured that they were what I
wanted (right location, right faculty), I chose my top 6 schools. They are:
CUNY, Toronto, UBC, UCR, Columbia, and Yale. God help me. I figure that the
scattershot approach is best for low-probability schools like this.

Now, it is often suggested that people get in contact with graduate students at
the universities they wish to attend. I'm shy (and statistically oriented), so I
decided instead to scrape the websites and send a batch email. In the email I
attached a survey asking for demographics and satisfaction ratings in a handful
of categories. I know that it's the end of the semester (December 3 as I am
writing), and that graduate students are busy, _and_ that it's very suspicious
to get a bulk email asking for somewhat identifying information. I am not
associating the emails of the students I contact to their answers, nor am I
collecting their names or their advisers. Instead, I am only asking for basic
demographic information such as age, minority status, employment status, and
income. I also am asking about TA availability at the university. Importantly,
all of this information is optional. As far as satisfaction rankings go, I am
asking about career opportunities, previous education, and feelings of safety on
and around campus. In addition, I requested volunteers to share application
materials, such as statements of purpose and writings samples. This data is not
to be shared and is solely for my benefit. (Gotta shoot your shot.)

It remains to be seen whether anybody responds to the survey. I am hoping so. I
will keep this blog updated with my application status and any further
information on my nefarious scheme to get people to help me.
