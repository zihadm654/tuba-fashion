"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addAddress, deleteAddress, getAddressess } from "@/actions/address";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { addressSchema } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/shared/icons";

type Address = {
  id: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  country: string;
};

interface AddressSelectorProps {
  onAddressSelect: (addressId: string) => void;
  selectedAddressId?: string;
}

export default function AddressSelector({
  onAddressSelect,
  selectedAddressId,
}: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewAddressDialog, setShowNewAddressDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: "",
      city: "",
      postalCode: "",
      phone: "",
    },
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);
      try {
        const response = await getAddressess();
        if (response.success && response.data) {
          setAddresses(response.data);

          // If there are addresses and none is selected, select the first one
          if (response.data.length > 0 && !selectedAddressId) {
            onAddressSelect(response.data[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [onAddressSelect, selectedAddressId]);

  const handleAddressSubmit = async (values: z.infer<typeof addressSchema>) => {
    setIsLoading(true);
    try {
      const result = await addAddress(values);
      if (result?.success) {
        // Refresh addresses
        const response = await getAddressess();
        if (response.success && response.data) {
          setAddresses(response.data);

          // Select the newly created address
          if (result.res && result.res.id) {
            onAddressSelect(result.res.id);
          }
        }
        setShowNewAddressDialog(false);
        form.reset();
      }
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

    setIsLoading(true);
    try {
      const result = await deleteAddress(addressToDelete);
      if (result?.success) {
        // Refresh addresses
        const response = await getAddressess();
        if (response.success && response.data) {
          setAddresses(response.data);

          // If the deleted address was selected, select another one if available
          if (selectedAddressId === addressToDelete) {
            if (response.data.length > 0) {
              onAddressSelect(response.data[0].id);
            } else {
              onAddressSelect(""); // No address selected
            }
          }
        }
        setShowDeleteDialog(false);
        setAddressToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Shipping Address</h3>
        <Dialog
          open={showNewAddressDialog}
          onOpenChange={setShowNewAddressDialog}
        >
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Icons.add className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
              <DialogDescription>
                Enter your shipping address details below.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddressSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your full address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your postal code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Address
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAddress}
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading && !addresses.length ? (
        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
          <Icons.spinner className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-muted-foreground">
            No saved addresses. Add a new address to continue.
          </p>
        </div>
      ) : (
        <RadioGroup
          value={selectedAddressId}
          onValueChange={onAddressSelect}
          className="space-y-3"
        >
          {addresses.map((address) => (
            <div key={address.id} className="flex items-start space-x-2">
              <RadioGroupItem
                value={address.id}
                id={address.id}
                className="mt-1"
              />
              <Card
                className={`flex-1 ${selectedAddressId === address.id ? "border-primary" : ""}`}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{address.address}</p>
                      <p className="text-muted-foreground text-sm">
                        {address.city}, {address.postalCode}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {address.country}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Phone: {address.phone}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive h-8 w-8"
                      onClick={(e) => {
                        e.preventDefault();
                        setAddressToDelete(address.id);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Icons.trash className="h-4 w-4" />
                      <span className="sr-only">Delete address</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
}
