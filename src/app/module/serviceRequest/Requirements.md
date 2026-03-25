1. createServiceRequest (logged-in customer can request for service. one time can request for one service, not multiple services)

2. getMyServiceRequestByCustomer (customer can see her all own service request)

3. getMyServiceRequestByServiceProvider (Service-Provider can see her all own service request,which are appended her)

4. getServiceRequestById (logged-in customer can view her own request for service. all request can view by Id => admin, manager, service_provider)

5. getAllServiceRequest (admin or manager can view all service request)

6. getAllServiceRequest (admin or manager can view all service request)

7. cancelServiceRequestByCustomer (customer can only cancel(soft delete) own request for service when service request status is pending)

8. updateServiceRequestByServiceProvider (service-provider can only update own request(Manager booked or appended service-request using service-provider's service-schedule) for service which service request appended her for work or appended service-schedule). View SR, Update SR (update status + add the service related cost). তবে SR টির জন্য payment সম্পন্ন হয়ে গেলে কোন কিছু পরিবর্তন করা যাবে না। SR এর কাজ টি সম্পন্ন হলে, সেই SR টি Status পরিবর্তন করে status completed করে দিবে এবং service related খরচগুলো add করে দিতে পারবে।

9. updateServiceRequestByManagement (admin or manager can accept or rejected a service-request. if rejected, then add a reason for rejected.). admin or manager চাইলে একটি SR একসেপ্ট অথবা রিজেক্ট করতে পারে। রিজেক্ট করার ক্ষেত্রে রিজেক্ট করার কারণ এড করতে হবে। একসেপ্ট করলে সেই SR টি একজন SP কে append করে দিতে হবে SP এর সিডিউল দেখে। সাথে কাস্টমারকে SP এবং SR এর ডিটেলস দিয়ে একটি ইমেইল পাঠাতে হবে।
