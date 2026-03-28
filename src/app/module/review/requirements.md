<!-- add the avg rating where needed it -->

1. giveReview: A customer can create a review after completed the service request payment. one customer can only one review for a service-request. when customer create a review, then it will be create in two tables.service table(which service he was request and completed payment) and service-provider table(which sp successfully completed the worked)
2. getAllReviews:(public) got the all reviews.
3. deleteReviewById: Admin can delete(not soft delete) a review.
4. getMyReviews: customer can got the all own reviews.
5. getMyReviewsBySP: service-provider can got the all own reviews.
6. getReviewsByService:(public) can got a specipick service all reviews.
